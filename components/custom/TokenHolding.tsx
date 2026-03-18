import React, { useEffect, useState } from 'react'
import { Inbox, Loader2, Search } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react';
import { useTokens } from '@/context/TokenContext';

const TokenHolding = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const [limit, setLimit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    const wallet = useWallet();
    const { tokens, isLoadingTokens: isLoading } = useTokens();

    const isEmpty = tokens.length === 0 && !isLoading;

    useEffect(() => {
        setPageIndex(0);
    }, [tokens]);

    useEffect(() => {
        setPageIndex(0);
    }, [searchQuery]);

    const filteredTokens = tokens.filter(token =>
        token.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleNextPage = () => {
        const totalPages = Math.ceil(filteredTokens.length / limit);
        if (pageIndex < totalPages - 1) {
            setPageIndex(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (pageIndex > 0) {
            setPageIndex(prev => prev - 1);
        }
    };

    const paginatedTokens = filteredTokens.slice(
        pageIndex * limit,
        (pageIndex + 1) * limit
    );

    return (
        <div className="glass-card overflow-hidden">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 p-1">
                <div>
                    <h2 className="text-xl font-bold text-white mb-1">Asset Allocation</h2>
                    <p className="text-muted-foreground text-sm font-medium">Distribution of your holdings</p>
                </div>
                {!isEmpty && !isLoading && (
                    <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">
                        <div className="relative group/search w-full md:w-72">
                            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within/search:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search Asset or Symbol..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-white/5 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-xs font-medium"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className=" pe-4 overflow-x-auto min-h-[400px] max-h-[500px] overflow-y-scroll custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
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
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <div className="flex flex-col items-center justify-center opacity-70">
                                        <Loader2 className="w-8 h-8 text-primary/50 animate-spin mb-4" />
                                        <p className="text-slate-200 font-bold">Scanning Wallet...</p>
                                        <p className="text-slate-500 text-xs mt-1">Retrieving your token balances and metadata</p>
                                    </div>
                                </td>
                            </tr>
                        ) : isEmpty ? (
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
                        ) : paginatedTokens.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <div className="flex flex-col items-center justify-center opacity-40">
                                        <div className="w-16 h-16 bg-slate-900/50 rounded-3xl flex items-center justify-center mb-6 border border-white/5">
                                            <Search className="w-8 h-8 text-slate-500" />
                                        </div>
                                        <p className="text-slate-200 font-bold">No matching assets</p>
                                        <p className="text-slate-500 text-xs mt-1">Try adjusting your search query</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedTokens.map((token, index) => (
                                <tr key={`${token.symbol}-${index}`} className="group hover:bg-white/2 transition-colors">
                                    <td className="py-4 md:py-5">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/5 rounded-lg md:rounded-xl text-lg md:text-xl group-hover:scale-110 transition-transform grow-0 shrink-0 overflow-hidden">
                                                {token.logo ? (
                                                    <img src={token.logo} alt={token.symbol} className="w-full h-full object-cover" />
                                                ) : (
                                                    '🪙'
                                                )}
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
                                            ${token.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
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
                                            ${token.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {!isEmpty && !isLoading && filteredTokens.length > 0 && (
                <div className="mt-8 flex items-center justify-between bg-white/2 border border-white/5 p-2 rounded-2xl">
                    <button
                        onClick={handlePrevPage}
                        disabled={pageIndex === 0 || isLoading}
                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-slate-300 font-bold text-xs rounded-xl border border-white/5 transition-all duration-200"
                    >
                        Previous
                    </button>
                    <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest text-center">
                        Page {pageIndex + 1} of {Math.max(1, Math.ceil(filteredTokens.length / limit))}
                    </div>
                    <button
                        onClick={handleNextPage}
                        disabled={pageIndex >= Math.ceil(filteredTokens.length / limit) - 1 || isLoading}
                        className="px-6 py-2.5 bg-primary/10 hover:bg-primary/20 disabled:opacity-30 disabled:hover:bg-primary/10 text-primary font-bold text-xs rounded-xl border border-primary/20 transition-all duration-200"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

export default TokenHolding