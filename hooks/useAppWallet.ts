import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useNetwork } from '@/context/NetworkContext';

export const TEST_WALLET_ADDRESS = new PublicKey("hrsf3w8rAd6JUTm3KBZS94oidu13gNyCSmZyBu27mta");

export function useAppWallet() {
    const wallet = useWallet();
    const { isTestMode } = useNetwork();

    return {
        ...wallet,
        connected: isTestMode ? true : wallet.connected,
        publicKey: isTestMode ? TEST_WALLET_ADDRESS : wallet.publicKey,
    };
}
