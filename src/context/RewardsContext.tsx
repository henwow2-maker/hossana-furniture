import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface PointTransaction {
  id: string;
  type: 'earn' | 'redeem';
  amount: number;
  description: string;
  date: string;
}

export interface RewardsVoucher {
  code: string;
  value: number;
  pointsCost: number;
  isRedeemed: boolean;
  dateRedeemed: string;
}

interface RewardsContextType {
  pointsBalance: number;
  pointsHistory: PointTransaction[];
  vouchers: RewardsVoucher[];
  appliedVoucher: RewardsVoucher | null;
  earnPointsFromPurchase: (amountSpent: number, orderId: string) => void;
  redeemVoucher: (pointsCost: number, value: number) => void;
  applyVoucher: (code: string) => boolean;
  removeVoucher: () => void;
  rewardsTier: { name: string; multiplier: number; color: string; nextTierPoints: number };
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export const RewardsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pointsBalance, setPointsBalance] = useState<number>(450);
  const [pointsHistory, setPointsHistory] = useState<PointTransaction[]>([
    {
      id: 'tx-1',
      type: 'earn',
      amount: 120,
      description: 'Acquired during Curated Order ORD-6542',
      date: '2026-04-15'
    },
    {
      id: 'tx-2',
      type: 'earn',
      amount: 330,
      description: 'Sign-up appreciation gift for Atelier onboarding',
      date: '2026-04-10'
    }
  ]);
  const [vouchers, setVouchers] = useState<RewardsVoucher[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<RewardsVoucher | null>(null);

  // Sync state with localStorage/sessionStorage so that updates reflect on refresh
  useEffect(() => {
    const savedPoints = localStorage.getItem('hossana_rewards_points');
    const savedHistory = localStorage.getItem('hossana_rewards_history');
    const savedVouchers = localStorage.getItem('hossana_rewards_vouchers');
    const savedApplied = localStorage.getItem('hossana_rewards_applied');

    if (savedPoints) setPointsBalance(Number(savedPoints));
    if (savedHistory) setPointsHistory(JSON.parse(savedHistory));
    if (savedVouchers) setVouchers(JSON.parse(savedVouchers));
    if (savedApplied) setAppliedVoucher(JSON.parse(savedApplied));
  }, []);

  const saveToStorage = (newPoints: number, newHistory: PointTransaction[], newVouchers: RewardsVoucher[], newApplied: RewardsVoucher | null) => {
    localStorage.setItem('hossana_rewards_points', newPoints.toString());
    localStorage.setItem('hossana_rewards_history', JSON.stringify(newHistory));
    localStorage.setItem('hossana_rewards_vouchers', JSON.stringify(newVouchers));
    if (newApplied) {
      localStorage.setItem('hossana_rewards_applied', JSON.stringify(newApplied));
    } else {
      localStorage.removeItem('hossana_rewards_applied');
    }
  };

  const earnPointsFromPurchase = (amountSpent: number, orderId: string) => {
    // 1 point for every $10 spent
    const pointsToEarn = Math.floor(amountSpent / 10);
    if (pointsToEarn <= 0) return;

    const newTx: PointTransaction = {
      id: `tx-earn-${Date.now()}`,
      type: 'earn',
      amount: pointsToEarn,
      description: `Disbursed for Order curation #${orderId}`,
      date: new Date().toISOString().split('T')[0]
    };

    const nextPoints = pointsBalance + pointsToEarn;
    const nextHistory = [newTx, ...pointsHistory];

    setPointsBalance(nextPoints);
    setPointsHistory(nextHistory);
    saveToStorage(nextPoints, nextHistory, vouchers, appliedVoucher);
    
    toast.success(`Congratulations! You earned ${pointsToEarn} Hossana Signature Points!`);
  };

  const redeemVoucher = (pointsCost: number, value: number) => {
    if (pointsBalance < pointsCost) {
      toast.error('Insufficient points. Continue acquiring masterpieces to earn more points.');
      return;
    }

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = `ATELIER-${value}-${randomSuffix}`;

    const newVoucher: RewardsVoucher = {
      code,
      value,
      pointsCost,
      isRedeemed: false,
      dateRedeemed: new Date().toISOString().split('T')[0]
    };

    const newTx: PointTransaction = {
      id: `tx-redeem-${Date.now()}`,
      type: 'redeem',
      amount: pointsCost,
      description: `Redeemed for bespoke $${value} luxury credit`,
      date: new Date().toISOString().split('T')[0]
    };

    const nextPoints = pointsBalance - pointsCost;
    const nextVouchers = [...vouchers, newVoucher];
    const nextHistory = [newTx, ...pointsHistory];

    setPointsBalance(nextPoints);
    setVouchers(nextVouchers);
    setPointsHistory(nextHistory);
    saveToStorage(nextPoints, nextHistory, nextVouchers, appliedVoucher);

    toast.success(`Successfully redeemed $${value} discount voucher! Use code ${code} at checkout.`);
  };

  const applyVoucher = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    
    // First, check if user has redeemed this specific voucher
    const userVoucher = vouchers.find(v => v.code === cleanCode && !v.isRedeemed);
    
    if (userVoucher) {
      setAppliedVoucher(userVoucher);
      saveToStorage(pointsBalance, pointsHistory, vouchers, userVoucher);
      toast.success(`Luxury promotional credit of $${userVoucher.value} successfully adjusted to your invoice!`);
      return true;
    }
    
    // Fallback support for generic reward mock codes to avoid frustrating visitors
    if (cleanCode.startsWith('ATELIER-') && cleanCode.includes('-')) {
      const parts = cleanCode.split('-');
      const value = Number(parts[1]);
      if (!isNaN(value) && value > 0) {
        const fallbackVoucher: RewardsVoucher = {
          code: cleanCode,
          value: value,
          pointsCost: value * 10,
          isRedeemed: false,
          dateRedeemed: new Date().toISOString().split('T')[0]
        };
        setAppliedVoucher(fallbackVoucher);
        saveToStorage(pointsBalance, pointsHistory, vouchers, fallbackVoucher);
        toast.success(`Promotional atelier code for $${value} applied!`);
        return true;
      }
    }

    // Direct error
    toast.error('Could not validate this design voucher. Please confirm code accuracy.');
    return false;
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    saveToStorage(pointsBalance, pointsHistory, vouchers, null);
    toast.info('Design promotional credit cleared.');
  };

  // Compute membership status tier based on total accumulated historical points & active balance
  // Bronze (< 500) | Silver (500-1500) | Gold (1500-4000) | Atelier Elite (4000+)
  const getRewardsTier = () => {
    // Determine historical points
    const earnedPointsTotal = pointsHistory
      .filter(tx => tx.type === 'earn')
      .reduce((sum, tx) => sum + tx.amount, 0);

    if (earnedPointsTotal < 500) {
      return { 
        name: 'Bronze Curator', 
        multiplier: 1.0, 
        color: 'from-amber-700 to-amber-900 border-amber-800 text-amber-500',
        nextTierPoints: 500 - earnedPointsTotal 
      };
    } else if (earnedPointsTotal < 1500) {
      return { 
        name: 'Silver Atelier', 
        multiplier: 1.25, 
        color: 'from-slate-400 to-slate-600 border-slate-500 text-slate-300',
        nextTierPoints: 1500 - earnedPointsTotal
      };
    } else if (earnedPointsTotal < 4000) {
      return { 
        name: 'Gold Providore', 
        multiplier: 1.5, 
        color: 'from-yellow-500 via-amber-400 to-yellow-600 border-yellow-400/50 text-yellow-500',
        nextTierPoints: 4000 - earnedPointsTotal
      };
    } else {
      return { 
        name: 'Atelier Sovereign', 
        multiplier: 2.0, 
        color: 'from-[#c71f2c]/40 via-red-950 to-stone-900 border-[#c71f2c]/50 text-red-500',
        nextTierPoints: 0 
      };
    }
  };

  return (
    <RewardsContext.Provider value={{
      pointsBalance,
      pointsHistory,
      vouchers,
      appliedVoucher,
      earnPointsFromPurchase,
      redeemVoucher,
      applyVoucher,
      removeVoucher,
      rewardsTier: getRewardsTier()
    }}>
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = () => {
  const context = useContext(RewardsContext);
  if (!context) throw new Error('useRewards must be used within a RewardsProvider');
  return context;
};
