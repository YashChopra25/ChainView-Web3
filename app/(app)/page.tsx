'use client'
import PortfolioOverview from '@/components/custom/PortfolioOverview'
import TokenHolding from '@/components/custom/TokenHolding'
import TransactionHistory from '@/components/custom/TransactionHistory'
import WalletBalance from '@/components/custom/WalletBalance'
import React, { useState } from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Wallet } from 'lucide-react'

const Home = () => {
  const [appState, setAppState] = useState<'full' | 'empty' | 'disconnected'>('full');

  return (
    <div className='min-h-screen flex flex-col gap-6 bg-background text-foreground py-6 px-4 md:py-10 md:px-8 relative overflow-hidden'>
      {/* Testing Controls - Fixed at bottom left for convenience */}
      <div className="fixed bottom-6 left-6 z-50 glass-card p-4! border-primary/20 bg-slate-950/90 shadow-2xl scale-90 origin-bottom-left hover:scale-100 transition-transform">
        <p className="text-[10px] uppercase tracking-widest font-black text-primary mb-3">Testing Controls</p>
        <RadioGroup value={appState} onValueChange={(v: any) => setAppState(v)} className="flex flex-col gap-2">
          <div className="flex items-center space-x-2 cursor-pointer group">
            <RadioGroupItem value="full" id="full" className="border-white/20 text-primary" />
            <Label htmlFor="full" className="text-xs text-slate-300 group-hover:text-white cursor-pointer font-bold">Full Data</Label>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer group">
            <RadioGroupItem value="empty" id="empty" className="border-white/20 text-primary" />
            <Label htmlFor="empty" className="text-xs text-slate-300 group-hover:text-white cursor-pointer font-bold">Empty State</Label>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer group">
            <RadioGroupItem value="disconnected" id="disconnected" className="border-white/20 text-primary" />
            <Label htmlFor="disconnected" className="text-xs text-slate-300 group-hover:text-white cursor-pointer font-bold">Disconnected</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full space-y-6 md:space-y-8 z-10">
        <PortfolioOverview state={appState} />

        {appState === 'disconnected' ? (
          <div className="glass-card flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-slate-400 max-w-sm mb-8">
              Please connect your wallet to view your portfolio, assets, and transaction history.
            </p>
            <button className="px-8 py-3 bg-primary text-primary-foreground font-black rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            <WalletBalance state={appState} />
            <TransactionHistory state={appState} />
            <TokenHolding state={appState} />
          </>
        )}
      </div>
    </div>
  )
}

export default Home