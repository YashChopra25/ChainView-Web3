'use client'
import React from 'react'

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

import '@solana/wallet-adapter-react-ui/styles.css';
import { useMemo } from "react";


import { NetworkProvider, useNetwork } from '@/context/NetworkContext';
import { LedgerWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';


function SolanaProviders({ children }: { children: React.ReactNode }) {
    const { network } = useNetwork();

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new LedgerWalletAdapter(),
        ],
        [network]
    );
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <NetworkProvider>
            <SolanaProviders>
                {children}
            </SolanaProviders>
        </NetworkProvider>
    )
}