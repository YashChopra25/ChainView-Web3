'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

type Network = WalletAdapterNetwork.Mainnet | WalletAdapterNetwork.Devnet;

interface NetworkContextType {
    network: Network;
    setNetwork: (network: Network) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
    const [network, setNetwork] = useState<Network>(WalletAdapterNetwork.Mainnet);

    return (
        <NetworkContext.Provider value={{ network, setNetwork }}>
            {children}
        </NetworkContext.Provider>
    );
}

export function useNetwork() {
    const context = useContext(NetworkContext);
    if (context === undefined) {
        throw new Error('useNetwork must be used within a NetworkProvider');
    }
    return context;
}
