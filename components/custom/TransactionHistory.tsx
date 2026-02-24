
'use client'
import React, { useState } from 'react'
import {
    Copy,
    ExternalLink,
    Search,
    ArrowUpRight,
    ArrowDownLeft,
    Repeat,
    Clock,
    CheckCircle,
    XCircle
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

const TransactionHistory = ({ state = 'full' }: { state?: 'full' | 'empty' }) => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const isEmpty = state === 'empty';

    // Mock data
    const walletInfo = {
        address: '0x742d35Cc6634C0532925a3b8D5c4c0a1b23F5678',
        balance: '2.4567',
        network: 'Ethereum Mainnet'
    };

    const portfolio = {
        totalValue: 15847.32,
        change24h: 8.45,
        changePercent: 0.054
    };



    const transactions = isEmpty ? [] : [
        {
            id: '1',
            type: 'send',
            token: 'ETH',
            amount: '0.5',
            value: 995.62,
            to: '0x1a2b3c...7f8g9h',
            hash: '0xabc123...def456',
            timestamp: '2 minutes ago',
            status: 'completed',
            fee: '0.008 ETH'
        },
        {
            id: '2',
            type: 'receive',
            token: 'USDC',
            amount: '1000.00',
            value: 1000.00,
            from: '0x9h8g7f...3c2b1a',
            hash: '0xdef456...abc123',
            timestamp: '1 hour ago',
            status: 'completed',
            fee: '0.005 ETH'
        },
        {
            id: '3',
            type: 'swap',
            token: 'UNI → ETH',
            amount: '50 → 0.2',
            value: 350.25,
            hash: '0x123abc...456def',
            timestamp: '3 hours ago',
            status: 'pending',
            fee: '0.012 ETH'
        },
        {
            id: '4',
            type: 'receive',
            token: 'LINK',
            amount: '100.00',
            value: 1400.20,
            from: '0x4d5e6f...9g0h1i',
            hash: '0x789ghi...012jkl',
            timestamp: '1 day ago',
            status: 'completed',
            fee: '0.003 ETH'
        },
        {
            id: '5',
            type: 'send',
            token: 'AAVE',
            amount: '2.50',
            value: 207.03,
            to: '0x2i1h0g...6f5e4d',
            hash: '0x345mno...678pqr',
            timestamp: '2 days ago',
            status: 'failed',
            fee: '0.006 ETH'
        }
    ];

    const getTransactionIcon = (type: string, status: string) => {
        if (status === 'pending') return <Clock className="w-4 h-4 text-yellow-400" />;
        if (status === 'failed') return <XCircle className="w-4 h-4 text-red-400" />;

        switch (type) {
            case 'send':
                return <ArrowUpRight className="w-4 h-4 text-red-400" />;
            case 'receive':
                return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
            case 'swap':
                return <Repeat className="w-4 h-4 text-blue-400" />;
            default:
                return <CheckCircle className="w-4 h-4 text-green-400" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        switch (status) {
            case 'completed':
                return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
            case 'failed':
                return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
            default:
                return baseClasses;
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };
    return (

        <div className="glass-card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-xl font-bold text-white mb-1">Activity</h2>
                    <p className="text-muted-foreground text-sm font-medium">Recent on-chain interactions</p>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                    <div className="relative group/search w-full md:w-64">
                        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2 group-focus-within/search:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter by hash..."
                            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/8 transition-all w-full text-sm"
                        />
                    </div>
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                        <SelectTrigger className="w-full md:w-40 bg-white/5 border-white/10 rounded-xl text-slate-200 focus:ring-primary/50 text-sm font-medium hover:bg-white/8 transition-all h-[38px] cursor-pointer">
                            <SelectValue placeholder="All Trades" />
                        </SelectTrigger>
                        <SelectContent className="glass-card bg-slate-950/90! border-white/10">
                            <SelectItem value="all" className="hover:bg-white/5 focus:bg-white/5 cursor-pointer">All Trades</SelectItem>
                            <SelectItem value="send" className="hover:bg-white/5 focus:bg-white/5 cursor-pointer">Outgoing</SelectItem>
                            <SelectItem value="receive" className="hover:bg-white/5 focus:bg-white/5 cursor-pointer">Incoming</SelectItem>
                            <SelectItem value="swap" className="hover:bg-white/5 focus:bg-white/5 cursor-pointer">Exchanges</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-1">
                {isEmpty ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center group">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-slate-500 group-hover:scale-110 transition-all duration-500 border border-white/5 group-hover:border-white/10">
                            <Clock className="w-8 h-8 opacity-20" />
                        </div>
                        <h3 className="text-slate-200 font-bold mb-1">No activity found</h3>
                        <p className="text-slate-500 text-xs font-medium max-w-[200px] leading-relaxed">
                            Transactions will appear here once they are broadcasted to the network
                        </p>
                    </div>
                ) : (
                    transactions.map((tx) => (
                        <div
                            key={tx.id}
                            className="group flex flex-col md:flex-row items-center justify-between p-4 rounded-2xl hover:bg-white/3 border border-transparent hover:border-white/5 transition-all duration-200"
                        >
                            <div className="flex flex-1 items-center justify-between w-full md:w-auto">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl group-hover:scale-105 transition-transform border border-white/5 shrink-0">
                                        {getTransactionIcon(tx.type, tx.status)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 md:gap-3 mb-0.5 md:mb-1">
                                            <span className="text-slate-200 font-bold text-sm md:text-base capitalize">{tx.type}</span>
                                            <span className={`text-[9px] md:text-[10px] uppercase tracking-tighter font-black px-1.5 md:py-0.5 rounded-md border ${tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                tx.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] md:text-[13px] text-slate-500 font-medium">
                                            <span>{tx.timestamp}</span>
                                            <span className="hidden sm:inline opacity-30">•</span>
                                            <span className="hidden sm:inline text-slate-400">{tx.fee}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right flex flex-col items-end md:hidden">
                                    <span className={`text-sm font-black ${tx.type === 'send' ? 'text-slate-200' : 'text-emerald-400'}`}>
                                        {tx.type === 'send' ? '-' : '+'}{tx.amount}
                                    </span>
                                    <span className="text-slate-500 text-[10px] font-bold">
                                        ${tx.value.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 md:gap-8 ml-auto md:ml-0 md:justify-end w-full md:w-auto mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                                <div className="hidden lg:block min-w-[120px]">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 text-right">Counterparty</p>
                                    <div className="flex items-center justify-end gap-2 text-primary hover:underline cursor-pointer font-mono text-xs">
                                        {tx.to ? formatAddress(tx.to) : tx.from ? formatAddress(tx.from) : 'DEX Protocol'}
                                        <ExternalLink className="w-3 h-3" />
                                    </div>
                                </div>

                                <div className="text-right hidden md:block min-w-[100px]">
                                    <div className="flex items-center justify-end gap-2 mb-1">
                                        <span className={`text-sm md:text-base font-black ${tx.type === 'send' ? 'text-slate-200' : 'text-emerald-400'}`}>
                                            {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.token}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-[10px] md:text-xs font-bold tracking-tight">
                                        ${tx.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity relative ml-auto md:ml-0">
                                    <button
                                        onClick={() => copyToClipboard(tx.hash)}
                                        className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                        title="Copy Hash"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                className="p-2 text-slate-500 hover:text-primary hover:bg-white/5 rounded-lg transition-all outline-hidden"
                                                title="Explore Transaction"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 glass-card p-2! border-white/10 bg-slate-950/80!">
                                            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-500 font-black px-2 py-1">
                                                View on Explorer
                                            </DropdownMenuLabel>
                                            <DropdownMenuItem asChild>
                                                <a
                                                    href={`https://solscan.io/tx/${tx.hash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between w-full px-3 py-2 rounded-xl hover:bg-white/5 text-sm text-slate-200 transition-colors group/link cursor-pointer"
                                                >
                                                    Solscan
                                                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                </a>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <a
                                                    href={`https://explorer.solana.com/tx/${tx.hash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between w-full px-3 py-2 rounded-xl hover:bg-white/5 text-sm text-slate-200 transition-colors group/link cursor-pointer"
                                                >
                                                    Solana Explorer
                                                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                </a>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {!isEmpty && (
                <div className="mt-8">
                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-sm rounded-xl border border-white/5 transition-all duration-200">
                        View Comprehensive History
                    </button>
                </div>
            )}
        </div>)
}

export default TransactionHistory