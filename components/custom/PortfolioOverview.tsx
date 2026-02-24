import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { Copy, LogOut, Wallet } from 'lucide-react'
import React from 'react'

const PortfolioOverview = ({ state = 'full' }: { state?: 'full' | 'empty' | 'disconnected' }) => {

    const wallet = useWallet()
    const isDisconnected = !wallet.connected

    return (
        <header className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 md:gap-6">
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 text-glow">
                        ChainView
                    </h1>
                    <p className="text-muted-foreground font-medium text-sm md:text-base">
                        Institutional-grade crypto analytics
                    </p>
                </div>

                <div className="glass-card p-3! rounded-2xl! flex items-center justify-center sm:justify-start gap-4 group mx-auto sm:mx-0">
                    <div className="relative">
                        <div className={`w-3 h-3 ${isDisconnected ? 'bg-rose-500' : 'bg-emerald-500'} rounded-full animate-pulse shadow-[0_0_10px_rgba(${isDisconnected ? '244,63,94' : '16,185,129'},0.5)]`}></div>
                        <div className={`absolute inset-0 w-3 h-3 ${isDisconnected ? 'bg-rose-500' : 'bg-emerald-500'} rounded-full animate-ping opacity-20`}></div>
                    </div>

                    <div className="border-l border-white/10 pl-4">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Status</p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-mono text-slate-200">
                                {isDisconnected ? 'Disconnected' : <>   {wallet.publicKey?.toBase58().slice(0, 6) + '...' + wallet.publicKey?.toBase58().slice(-4)}</>}

                            </span>
                            {!isDisconnected && (
                                <button className="text-muted-foreground hover:text-primary transition-colors">
                                    <Copy className="w-3.5 h-3.5" onClick={() => navigator.clipboard.writeText(wallet.publicKey?.toBase58() || '')} />
                                </button>
                            )}
                        </div>
                    </div>
                    {
                        !isDisconnected ? (
                            <div onClick={() => wallet.disconnect()} className={`p-2 rounded-xl group-hover:scale-110 transition-transform ${isDisconnected ? 'bg-rose-500/10 text-rose-500' : 'bg-primary/10 text-primary'}`}>
                                <LogOut className="w-5 h-5" />
                            </div>
                        ) :
                            <div className={`p-2 rounded-xl group-hover:scale-110 transition-transform ${isDisconnected ? 'bg-rose-500/10 text-rose-500' : 'bg-primary/10 text-primary'}`}>
                                <Wallet className="w-5 h-5" />
                            </div>
                    }
                </div>
            </div>
        </header>
    )
}

export default PortfolioOverview