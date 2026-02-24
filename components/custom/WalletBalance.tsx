import { TrendingUp, TrendingDown, PieChart } from 'lucide-react'
import React from 'react'

const WalletBalance = ({ state = 'full' }: { state?: 'full' | 'empty' }) => {
    const isEmpty = state === 'empty';

    const portfolio = isEmpty ? {
        totalValue: 0,
        change24h: 0,
        changePercent: 0
    } : {
        totalValue: 15847.32,
        change24h: 8.45,
        changePercent: 0.054
    };

    const walletInfo = {
        balance: isEmpty ? 0 : 10000,
        change24h: isEmpty ? 0 : 8.45,
        changePercent: isEmpty ? 0 : 0.054
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 glass-card relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/30 transition-colors" />

                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
                    Portfolio Performance
                </h2>

                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-2">Total Net Worth</p>
                        <div className="flex flex-wrap items-center gap-3 md:gap-4">
                            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tighter">
                                ${portfolio.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            {!isEmpty && (
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border ${portfolio.changePercent >= 0
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                    }`}>
                                    {portfolio.changePercent >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                    {portfolio.changePercent >= 0 ? '+' : ''}{portfolio.changePercent.toFixed(2)}%
                                </div>
                            )}
                        </div>
                        <p className="text-muted-foreground text-xs md:text-sm mt-3 flex items-center gap-2">
                            {isEmpty ? (
                                <span className="opacity-50 italic">No market data available for current selection</span>
                            ) : (
                                <>
                                    <span className={portfolio.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                        {portfolio.change24h >= 0 ? '▲' : '▼'} ${Math.abs(portfolio.change24h).toFixed(2)}
                                    </span>
                                    <span className="opacity-50">vs last 24h</span>
                                </>
                            )}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-wrap">
                        {['1D', '1W', '1M', '1Y', 'ALL'].map((tab) => (
                            <button key={tab} className={`px-2 md:px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all ${tab === '1D' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-white/5'
                                }`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {isEmpty && (
                    <div className="mt-8 py-10 border-t border-white/5 flex flex-col items-center justify-center text-center opacity-40">
                        <PieChart className="w-8 h-8 mb-3 text-slate-500" />
                        <p className="text-sm font-medium text-slate-400">No performance history to display</p>
                    </div>
                )}
            </div>

            <div className="glass-card flex flex-col">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
                    Top Asset
                </h3>
                <div className="flex-1 flex flex-col justify-center">
                    {isEmpty ? (
                        <div className="p-8 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center group transition-colors hover:border-white/20">
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl mb-4 text-slate-500 group-hover:scale-110 transition-transform">
                                ?
                            </div>
                            <p className="text-slate-200 font-bold mb-1">No Assets Discovered</p>
                            <p className="text-slate-500 text-[10px] font-medium leading-relaxed">Top performing assets will appear here once verified</p>
                        </div>
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
                                <p className="text-white font-bold">{walletInfo.balance.toLocaleString()}</p>
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