import { useConnection } from '@solana/wallet-adapter-react';
import { useAppWallet } from '@/hooks/useAppWallet';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { AlertCircle, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Skeleton } from '../ui/skeleton';
import { useTokens } from '@/context/TokenContext';

const WalletBalance = () => {
    const wallet = useAppWallet();
    const { connection } = useConnection();
    const [balance, setBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { topToken, isLoadingTokens: isLoadingTopToken } = useTokens();

    const getBalance = async () => {
        if (wallet.connected && wallet.publicKey) {
            try {
                setIsLoading(true);
                setError(null);
                const balance = await connection.getBalance(wallet.publicKey)
                setBalance(balance / LAMPORTS_PER_SOL)
            } catch (err) {
                console.error('Error fetching balance:', err);
                setBalance(0)
            } finally {
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        if (wallet.connected && wallet.publicKey) {
            getBalance();
        } else {
            setBalance(0);
        }
    }, [wallet.connected, wallet.publicKey, connection]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 glass-card relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/30 transition-colors" />

                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
                    Portfolio Performance
                </h2>

                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <p className="text-slate-400 text-sm font-medium">Total Net Worth</p>
                        {isLoading && <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" />}
                    </div>

                    <div className="flex flex-col gap-3">
                        {error ? (
                            <div className="flex items-center gap-3 text-rose-400 bg-rose-500/10 py-2 px-4 rounded-xl border border-rose-500/20 animate-in fade-in slide-in-from-left-2 duration-300">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span className="text-sm font-medium">{error}</span>
                                <button
                                    onClick={() => getBalance()}
                                    className="ml-2 text-xs font-bold uppercase tracking-wider bg-rose-500/20 hover:bg-rose-500/30 px-2 py-1 rounded-md transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 transition-all duration-500">
                                {
                                    isLoading ?
                                        <Skeleton className='w-32 h-12 bg-white/10' /> :
                                        <span className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tighter`}>
                                            SOL {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                }
                            </div>
                        )}
                    </div>
                </div>

            </div>

            <div className="glass-card flex flex-col">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
                    Top Asset
                </h3>
                <div className="flex-1 flex flex-col justify-center">
                    {wallet.connected ? (
                        isLoadingTopToken ? (
                            <div className="p-8 border border-white/5 bg-white/2 rounded-2xl flex flex-col items-center justify-center text-center">
                                <RefreshCw className="w-6 h-6 text-primary animate-spin mb-3" />
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Discovering...</p>
                            </div>
                        ) : topToken ? (
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group/asset">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover/asset:scale-110 transition-transform overflow-hidden bg-white/10">
                                    {topToken.logo ? (
                                        <img src={topToken.logo} alt={topToken.symbol} className="w-full h-full object-cover" />
                                    ) : (
                                        '🪙'
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-bold">{topToken.symbol}</p>
                                    <p className="text-slate-500 text-xs font-medium tracking-tight truncate max-w-[120px]">{topToken.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-bold">{topToken.amount}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center group transition-colors hover:border-white/20">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl mb-4 text-slate-500 group-hover:scale-110 transition-transform">
                                    ?
                                </div>
                                <p className="text-slate-200 font-bold mb-1">No Assets Discovered</p>
                                <p className="text-slate-500 text-[10px] font-medium leading-relaxed">Top performing assets will appear here once verified</p>
                            </div>
                        )
                    ) : (
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group/asset">
                            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg group-hover/asset:scale-110 transition-transform">
                                🔷
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-bold">Ethereum</p>
                                <p className="text-slate-500 text-xs font-medium tracking-tight">ETH / Mainnet</p>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-bold">2.4567</p>
                                <p className="text-emerald-400 text-xs font-bold">$4,892.18</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default WalletBalance