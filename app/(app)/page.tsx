'use client'
import PortfolioOverview from '@/components/custom/PortfolioOverview'
import TokenHolding from '@/components/custom/TokenHolding'
import TransactionHistory from '@/components/custom/TransactionHistory'
import WalletBalance from '@/components/custom/WalletBalance'
import { useState } from 'react'
import { Wallet } from 'lucide-react'
import { useAppWallet } from '@/hooks/useAppWallet'
import { useNetwork } from '@/context/NetworkContext'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const Home = () => {
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const wallet = useAppWallet();
  const { isTestMode, setIsTestMode } = useNetwork();

  return (
    <div className='min-h-screen flex flex-col gap-6 bg-background text-foreground py-6 px-4 md:py-10 md:px-8 relative overflow-hidden'>
      {isTestMode && (
        <div className="absolute top-0 left-0 w-full bg-amber-500/10 border-b border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest text-center py-2 z-50 shadow-md flex items-center justify-center gap-2 backdrop-blur-md">
           🧪 You are in Test Mode (Demo Wallet)
           <button onClick={() => setIsTestMode(false)} className="underline hover:text-amber-400 ml-2">Exit Test Mode</button>
        </div>
      )}
      <div className={`max-w-7xl mx-auto w-full space-y-6 md:space-y-8 z-10 ${isTestMode ? 'mt-8' : ''}`}>
        <PortfolioOverview />

        {!wallet.connected ? (
          <div className="glass-card flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-slate-400 max-w-sm mb-8">
              Please connect your wallet to view your portfolio, assets, and transaction history.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
                <DialogTrigger asChild>
                  <button className="px-8 py-3 bg-primary text-primary-foreground font-black rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] w-full sm:w-auto">
                    Connect Wallet
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md border-primary/20 bg-slate-900/95 backdrop-blur-xl">
                  <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-bold text-white">Select Your Wallet</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {wallet.wallets.length > 0 ? (
                      wallet.wallets.map((w) => (
                        <Button
                          key={w.adapter.name}
                          onClick={() => {
                            wallet.select(w.adapter.name);
                            setIsWalletDialogOpen(false);
                          }}
                          variant="ghost"
                          className="w-full flex items-center justify-between h-16 px-4 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 transition-all group overflow-hidden"
                        >
                          <span className="font-bold text-slate-200 group-hover:text-white">{w.adapter.name}</span>
                          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center p-2 group-hover:bg-white/20 transition-colors">
                            <img src={w.adapter.icon} alt={w.adapter.name} className="w-full h-full object-contain" />
                          </div>
                        </Button>
                      ))
                    ) : (
                      <p className="text-center text-slate-400 py-10">No wallets found. Please install a Solana wallet extension.</p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <button 
                onClick={() => setIsTestMode(true)} 
                className="px-8 py-3 bg-white/5 text-white font-black rounded-xl hover:bg-white/10 transition-all border border-white/10 shadow-sm w-full sm:w-auto"
              >
                View Demo Mode
              </button>
            </div>
          </div>
        ) : (
          <>
            <WalletBalance />
            <TransactionHistory />
            <TokenHolding />
          </>
        )}
      </div>
    </div>
  )
}

export default Home