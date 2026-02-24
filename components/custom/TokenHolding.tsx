import React from 'react'
import { Inbox } from 'lucide-react'

const TokenHolding = ({ state = 'full' }: { state?: 'full' | 'empty' }) => {
    const isEmpty = state === 'empty';

    const tokens = isEmpty ? [] : [
        { symbol: 'ETH', name: 'Ethereum', amount: '2.4567', price: 1991.24, change: 3.42, value: 4892.18, logo: '🔷' },
        { symbol: 'USDC', name: 'USD Coin', amount: '5000.00', price: 1.00, change: 0.01, value: 5000.00, logo: '💵' },
        { symbol: 'UNI', name: 'Uniswap', amount: '150.00', price: 7.25, change: -2.18, value: 1087.50, logo: '🦄' },
        { symbol: 'LINK', name: 'Chainlink', amount: '300.00', price: 18.45, change: 5.67, value: 5535.00, logo: '🔗' },
        { symbol: 'AAVE', name: 'Aave', amount: '8.50', price: 85.40, change: -1.23, value: 725.90, logo: '👻' },
    ];

    return (
        <div className="glass-card overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-white mb-1">Asset Allocation</h2>
                    <p className="text-muted-foreground text-sm font-medium">Distribution of your holdings</p>
                </div>
                {!isEmpty && <button className="text-primary text-sm font-bold hover:underline">Manage Assets</button>}
            </div>

            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[600px] md:min-w-full">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="text-left text-slate-500 text-[10px] uppercase tracking-widest font-black py-4">Asset</th>
                            <th className="text-right text-slate-500 text-[10px] uppercase tracking-widest font-black py-4">Balance</th>
                            <th className="text-right text-slate-500 text-[10px] uppercase tracking-widest font-black py-4 hidden sm:table-cell">Market Price</th>
                            <th className="text-right text-slate-500 text-[10px] uppercase tracking-widest font-black py-4">24h Change</th>
                            <th className="text-right text-slate-500 text-[10px] uppercase tracking-widest font-black py-4">Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/3">
                        {isEmpty ? (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <div className="flex flex-col items-center justify-center opacity-40">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                            <Inbox className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-slate-200 font-bold">No assets found in this wallet</p>
                                        <p className="text-slate-500 text-xs mt-1">Acquire tokens to see them listed here</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            tokens.map((token) => (
                                <tr key={token.symbol} className="group hover:bg-white/2 transition-colors">
                                    <td className="py-4 md:py-5">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/5 rounded-lg md:rounded-xl text-lg md:text-xl group-hover:scale-110 transition-transform grow-0 shrink-0">
                                                {token.logo}
                                            </div>
                                            <div>
                                                <p className="text-slate-100 font-bold text-sm md:text-base">{token.symbol}</p>
                                                <p className="text-slate-500 text-[10px] md:text-[11px] font-bold tracking-tight">{token.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-right py-4 md:py-5">
                                        <p className="text-slate-200 font-mono text-xs md:text-sm">{token.amount}</p>
                                    </td>
                                    <td className="text-right py-4 md:py-5 hidden sm:table-cell">
                                        <p className="text-slate-200 font-bold text-xs md:text-sm">
                                            ${token.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                    </td>
                                    <td className="text-right py-4 md:py-5">
                                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] md:text-[11px] font-black border ${token.change >= 0
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10'
                                            : 'bg-rose-500/10 text-rose-400 border-rose-500/10'
                                            }`}>
                                            {token.change >= 0 ? '+' : ''}{token.change.toFixed(2)}%
                                        </div>
                                    </td>
                                    <td className="text-right py-4 md:py-5">
                                        <p className="text-white font-black text-sm md:text-base">
                                            ${token.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {!isEmpty && (
                <div className="mt-6 pt-6 border-t border-white/5 text-center">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Institutional Asset Discovery Active</p>
                </div>
            )}
        </div>
    )
}

export default TokenHolding