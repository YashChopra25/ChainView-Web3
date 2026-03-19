'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useAppWallet } from '@/hooks/useAppWallet';
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from '@solana/web3.js';
import { Metaplex } from "@metaplex-foundation/js";

interface TokenContextType {
    tokens: any[];
    topToken: any;
    isLoadingTokens: boolean;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: ReactNode }) {
    const [tokens, setTokens] = useState<any[]>([]);
    const [topToken, setTopToken] = useState<any>(null);
    const [isLoadingTokens, setIsLoadingTokens] = useState(false);

    const wallet = useAppWallet();
    const { connection } = useConnection();

    useEffect(() => {
        async function getTokenMetadata(key: string) {
            try {
                const metaplex = Metaplex.make(connection);
                const mintAddress = new PublicKey(key);

                const metadataAccount = metaplex
                    .nfts()
                    .pdas()
                    .metadata({ mint: mintAddress });

                const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);
                if (metadataAccountInfo) {
                    const token = await metaplex.nfts().findByMint({ mintAddress: mintAddress });
                    return {
                        name: token.name,
                        symbol: token.symbol,
                        logo: token?.json?.image,
                        status: true
                    }
                }
            } catch (error) {
                // Ignore metadata errors for tokens without metadata
            }
            return {
                name: "Unknown Token",
                symbol: "UNK",
                logo: null,
                status: false
            }
        }

        async function fetchSPLTokens() {
            if (!wallet.publicKey) {
                setTokens([]);
                setTopToken(null);
                return;
            }

            try {
                setIsLoadingTokens(true);
                // Fetch both normal tokens and Token-2022 tokens
                const [accounts, accounts2022] = await Promise.all([
                    connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
                        programId: TOKEN_PROGRAM_ID
                    }),
                    connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
                        programId: TOKEN_2022_PROGRAM_ID
                    })
                ]);

                const allAccounts = [...accounts.value, ...accounts2022.value];
                console.log("ALlCouu", allAccounts) // Preserving user debug log

                if (allAccounts.length > 0) {
                    const tokenPromises = allAccounts.map(async element => {
                        const parsedInfo = element.account.data.parsed.info;
                        const mintAddress = parsedInfo.mint;
                        const uiAmount = parsedInfo.tokenAmount.uiAmountString;

                        // // Ignore tokens with 0 balance
                        // if (Number(uiAmount) === 0) return null;

                        const metadata = await getTokenMetadata(mintAddress);

                        return {
                            symbol: metadata.symbol,
                            name: metadata.name,
                            amount: uiAmount,
                            price: 0, // Feature to expand: fetch live price using Jupiter API or CoinGecko
                            change: 0,
                            value: 0, // amount * price
                            logo: metadata.logo
                        };
                    });

                    const fetchedTokens = (await Promise.all(tokenPromises)).filter(t => t !== null);

                    // Evaluate top asset by token UI amount
                    let highestToken = null;
                    let maxAmt = -1;
                    for (const t of fetchedTokens) {
                        const amt = Number(t.amount);
                        if (amt > maxAmt) {
                            maxAmt = amt;
                            highestToken = t;
                        }
                    }

                    // Sort tokens by balance or let them remain mostly in default order (currently not explicit)
                    setTokens(fetchedTokens);
                    setTopToken(highestToken);
                } else {
                    setTokens([]);
                    setTopToken(null);
                }
            } catch (error) {
                console.error("Error fetching SPL tokens:", error)
            } finally {
                setIsLoadingTokens(false);
            }
        }

        if (wallet.connected) {
            fetchSPLTokens()
        } else {
            setTokens([]);
            setTopToken(null);
        }
    }, [wallet.publicKey, wallet.connected, connection])

    return (
        <TokenContext.Provider value={{ tokens, topToken, isLoadingTokens }}>
            {children}
        </TokenContext.Provider>
    );
}

export function useTokens() {
    const context = useContext(TokenContext);
    if (context === undefined) {
        throw new Error('useTokens must be used within a TokenProvider');
    }
    return context;
}
