'use client'
import React, { useEffect, useState } from 'react'
import {
    Copy,
    ExternalLink,
    Search,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    XCircle,
    Hash,
    Layers,
    Calendar,
    ChevronRight,
    Filter
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useNetwork } from '@/context/NetworkContext';
import Link from 'next/link';

interface Transaction {
    blockTime: number | null;
    confirmationStatus: string;
    err: any | null;
    memo: string | null;
    signature: string;
    slot: number;
}

const TransactionHistory = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const wallet = useWallet()
    const { connection } = useConnection()
    const { network } = useNetwork()

    async function fetchTransactions() {
        if (!wallet.publicKey) return;
        setLoading(true);
        setError(null);
        try {
            const fetched = await connection.getSignaturesForAddress(wallet.publicKey, {
                limit: 100, //Only fetching the 100 transactions for the user.
            });
            setTransactions(fetched as Transaction[]);
            setPageIndex(0); // Reset to first page on new fetch
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
            setTransactions([])
            // setError("Unable to load transaction history. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTransactions();
    }, [wallet.connected, wallet.publicKey, connection]);

    const handleNextPage = () => {
        const totalPages = Math.ceil(filteredTransactions.length / limit);
        if (pageIndex < totalPages - 1) {
            setPageIndex(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (pageIndex > 0) {
            setPageIndex(prev => prev - 1);
        }
    };

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.signature.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedFilter === 'all' ||
            (selectedFilter === 'success' && !tx.err) ||
            (selectedFilter === 'failed' && tx.err) ||
            (selectedFilter === 'finalized' && tx.confirmationStatus === 'finalized');
        return matchesSearch && matchesFilter;
    });

    const paginatedTransactions = filteredTransactions.slice(
        pageIndex * limit,
        (pageIndex + 1) * limit
    );

    const formatTimestamp = (timestamp: number | null) => {
        if (!timestamp) return 'Time Pending';
        const date = new Date(timestamp * 1000);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatSignature = (sig: string) => {
        return `${sig.slice(0, 8)}...${sig.slice(-8)}`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const getStatusIcon = (tx: Transaction) => {
        if (tx.err) return <XCircle className="w-4 h-4 text-rose-500" />;
        if (tx.confirmationStatus === 'processed') return <Clock className="w-4 h-4 text-amber-500 animate-pulse" />;
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    };

    const getStatusStyles = (tx: Transaction) => {
        if (tx.err) return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
        if (tx.confirmationStatus === 'processed') return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        if (tx.confirmationStatus === 'confirmed') return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    };

    return (
        <div className="glass-card overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 p-1">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        Transaction History
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Live</span>
                    </h2>
                    <p className="text-slate-400 text-sm font-medium mt-1 flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5" />
                        Explore your latest on-chain activity
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-3">
                    <div className="relative group/search w-full md:w-72">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within/search:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search Signature..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-white/5 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-xs font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                            <SelectTrigger className="flex-1 md:w-36 bg-slate-900/50 border-white/5 rounded-xl text-slate-200 focus:ring-primary/40 hover:bg-slate-900 transition-all h-[38px] font-semibold text-xs">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-3 h-3 text-slate-500" />
                                    <SelectValue placeholder="Filter" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="bg-slate-950 border-white/10 rounded-xl shadow-2xl">
                                <SelectItem value="all" className="focus:bg-white/5 cursor-pointer rounded-lg m-1">All Activity</SelectItem>
                                <SelectItem value="success" className="focus:bg-white/5 cursor-pointer rounded-lg m-1 text-emerald-400">Successful</SelectItem>
                                <SelectItem value="failed" className="focus:bg-white/5 cursor-pointer rounded-lg m-1 text-rose-400">Failed</SelectItem>
                                <SelectItem value="finalized" className="focus:bg-white/5 cursor-pointer rounded-lg m-1 text-primary">Finalized</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={limit.toString()} onValueChange={(val) => setLimit(parseInt(val))}>
                            <SelectTrigger className="w-20 bg-slate-900/50 border-white/5 rounded-xl text-slate-200 focus:ring-primary/40 hover:bg-slate-900 transition-all h-[38px] font-semibold text-xs">
                                <SelectValue placeholder="Show 10" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-950 border-white/10 rounded-xl shadow-2xl">
                                {[10, 20, 30, 40].map((num) => (
                                    <SelectItem key={num} value={num.toString()} className="focus:bg-white/5 cursor-pointer rounded-lg m-1">
                                        {num}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="space-y-3 min-h-[400px] max-h-[500px] overflow-y-scroll pe-4">
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-24 bg-white/2 border border-white/5 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="py-24 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mb-6 border border-rose-500/20 relative">
                            <div className="absolute inset-0 bg-rose-500/5 blur-2xl rounded-full"></div>
                            <XCircle className="w-10 h-10 text-rose-500 relative z-10" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-200 mb-2">Something went wrong</h3>
                        <p className="text-slate-500 text-sm max-w-[280px] leading-relaxed mx-auto mb-6">
                            {error}
                        </p>
                        <button
                            onClick={() => fetchTransactions()}
                            className="px-8 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-2xl font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                            Retry Request
                        </button>
                    </div>
                ) : paginatedTransactions.length === 0 ? (
                    <div className="py-24 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-900/50 rounded-3xl flex items-center justify-center mb-6 border border-white/5 relative">
                            <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full"></div>
                            <Clock className="w-10 h-10 text-slate-600/30 relative z-10" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-200 mb-2">No transactions found</h3>
                        <p className="text-slate-500 text-sm max-w-[280px] leading-relaxed mx-auto">
                            {searchQuery ? "No results match your current search terms and filters." : "Your on-chain activity will start appearing here once processed."}
                        </p>
                    </div>
                ) : (
                    paginatedTransactions.map((tx) => (
                        <div
                            key={tx.signature}
                            className="group p-5 bg-white/2 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-3xl transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Hover Gradient Effect */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                                {/* Left Section: Signature & Meta */}
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`p-3 rounded-2xl border flex items-center justify-center shrink-0 ${tx.err ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-slate-900/50 border-white/10 text-primary'}`}>
                                        {tx.err ? <XCircle className="w-6 h-6" /> : <Hash className="w-6 h-6" />}
                                    </div>
                                    <div className="space-y-1.5 overflow-hidden">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-white font-black text-sm md:text-base tracking-tight font-mono truncate">
                                                {formatSignature(tx.signature)}
                                            </span>
                                            <button
                                                onClick={() => copyToClipboard(tx.signature)}
                                                className="p-1 text-slate-500 hover:text-white transition-colors"
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                            <span className="flex items-center gap-1.5 text-[11px] md:text-xs text-slate-500 font-bold">
                                                <Calendar className="w-3 h-3 opacity-60" />
                                                {formatTimestamp(tx.blockTime)}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-[11px] md:text-xs text-slate-500 font-bold">
                                                <Layers className="w-3 h-3 opacity-60" />
                                                Slot: {tx.slot.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section: Status & Actions */}
                                <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto mt-2 lg:mt-0 lg:ml-auto">
                                    {/* Confirmation Badge */}
                                    <div className="flex flex-col items-start lg:items-end gap-1.5">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(tx)} flex items-center gap-1.5`}>
                                            {getStatusIcon(tx)}
                                            {tx.err ? 'Failed' : tx.confirmationStatus}
                                        </span>
                                        {tx.memo && (
                                            <p className="text-[10px] text-slate-500 font-medium italic truncate max-w-[150px]">
                                                {tx.memo}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold text-slate-300 transition-all">
                                                    Details
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 bg-slate-950 border-white/10 rounded-2xl p-2 shadow-2xl">
                                                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-500 font-black px-2 pb-2">
                                                    Explore Transaction
                                                </DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`https://solscan.io/tx/${tx.signature}?cluster=${network}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-slate-200 transition-colors group/link"
                                                    >
                                                        Solscan
                                                        <ArrowUpRight className="w-4 h-4 opacity-40 group-hover/link:opacity-100 transition-all group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`https://explorer.solana.com/tx/${tx.signature}?cluster=${network}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-slate-200 transition-colors group/link"
                                                    >
                                                        Solana Explorer
                                                        <ArrowUpRight className="w-4 h-4 opacity-40 group-hover/link:opacity-100 transition-all group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        <Link
                                            href={`https://solscan.io/tx/${tx.signature}?cluster=${network}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-xl text-primary transition-all hidden sm:block"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination / Footer */}
            {filteredTransactions.length > 0 && (
                <div className="mt-8 flex items-center justify-between bg-white/2 border border-white/5 p-2 rounded-2xl">
                    <button
                        onClick={handlePrevPage}
                        disabled={pageIndex === 0 || loading}
                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-slate-300 font-bold text-xs rounded-xl border border-white/5 transition-all duration-200"
                    >
                        Previous
                    </button>
                    <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest text-center">
                        Page {pageIndex + 1} of {Math.ceil(filteredTransactions.length / limit)}
                    </div>
                    <button
                        onClick={handleNextPage}
                        disabled={pageIndex >= Math.ceil(filteredTransactions.length / limit) - 1 || loading}
                        className="px-6 py-2.5 bg-primary/10 hover:bg-primary/20 disabled:opacity-30 disabled:hover:bg-primary/10 text-primary font-bold text-xs rounded-xl border border-primary/20 transition-all duration-200"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;