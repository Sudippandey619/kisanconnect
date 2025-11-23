// Wallet Management Utilities for KisanConnect

export interface WalletTransaction {
  id: string;
  type: 'payment' | 'refund' | 'payout' | 'topup' | 'transfer' | 'cashback' | 'reward';
  amount: number;
  currency: 'NPR' | 'USD';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  from?: string;
  to?: string;
  description: string;
  descriptionNepali: string;
  orderId?: string;
  paymentMethod: string;
  fees: number;
  timestamp: string;
  category: 'food' | 'transport' | 'utility' | 'shopping' | 'transfer' | 'other';
  metadata?: any;
}

export interface WalletData {
  balance: number;
  currency: 'NPR' | 'USD';
  frozenAmount: number;
  creditLimit: number;
  creditUsed: number;
  pendingPayouts: number;
  totalEarnings: number;
  totalSpent: number;
  loyaltyPoints: number;
  cashbackEarned: number;
  accountTier: 'basic' | 'silver' | 'gold' | 'platinum';
  monthlySpending: number;
  spendingLimit: number;
  autoReloadEnabled: boolean;
  autoReloadAmount: number;
  autoReloadThreshold: number;
}

export class WalletManager {
  private static walletData: WalletData = {
    balance: 2450,
    currency: 'NPR',
    frozenAmount: 0,
    creditLimit: 50000,
    creditUsed: 0,
    pendingPayouts: 0,
    totalEarnings: 50000,
    totalSpent: 25000,
    loyaltyPoints: 1250,
    cashbackEarned: 750,
    accountTier: 'gold',
    monthlySpending: 8500,
    spendingLimit: 30000,
    autoReloadEnabled: true,
    autoReloadAmount: 1000,
    autoReloadThreshold: 500
  };

  private static transactions: WalletTransaction[] = [];

  static getWalletData(): WalletData {
    return { ...this.walletData };
  }

  static getBalance(): number {
    return this.walletData.balance;
  }

  static getAvailableBalance(): number {
    return this.walletData.balance - this.walletData.frozenAmount;
  }

  static addMoney(amount: number, paymentMethod: string, description?: string): WalletTransaction {
    const transaction: WalletTransaction = {
      id: `txn_${Date.now()}`,
      type: 'topup',
      amount,
      currency: 'NPR',
      status: 'completed',
      description: description || `Wallet top-up via ${paymentMethod}`,
      descriptionNepali: `${paymentMethod} मार्फत वालेट टप-अप`,
      paymentMethod,
      fees: paymentMethod === 'khalti' ? 0 : amount * 0.02,
      timestamp: new Date().toISOString(),
      category: 'transfer'
    };

    this.transactions.unshift(transaction);
    this.walletData.balance += amount;
    this.walletData.totalEarnings += amount;
    
    // Add loyalty points (1 point per 100 NPR)
    const pointsEarned = Math.floor(amount / 100);
    this.walletData.loyaltyPoints += pointsEarned;

    this.saveData();
    return transaction;
  }

  static deductMoney(amount: number, orderId?: string, description?: string): boolean {
    if (this.getAvailableBalance() < amount) {
      return false; // Insufficient balance
    }

    const transaction: WalletTransaction = {
      id: `txn_${Date.now()}`,
      type: 'payment',
      amount,
      currency: 'NPR',
      status: 'completed',
      description: description || `Payment for order ${orderId}`,
      descriptionNepali: orderId ? `अर्डर ${orderId} को भुक्तानी` : 'भुक्तानी',
      orderId,
      paymentMethod: 'wallet',
      fees: 0,
      timestamp: new Date().toISOString(),
      category: 'food'
    };

    this.transactions.unshift(transaction);
    this.walletData.balance -= amount;
    this.walletData.totalSpent += amount;
    this.walletData.monthlySpending += amount;

    // Add cashback (2% for gold tier)
    const cashbackRate = this.getCashbackRate();
    const cashback = amount * cashbackRate;
    if (cashback > 0) {
      this.addCashback(cashback, orderId);
    }

    // Check auto-reload
    if (this.walletData.autoReloadEnabled && this.walletData.balance <= this.walletData.autoReloadThreshold) {
      this.autoReload();
    }

    this.saveData();
    return true;
  }

  static addCashback(amount: number, orderId?: string): WalletTransaction {
    const transaction: WalletTransaction = {
      id: `txn_${Date.now()}_cb`,
      type: 'cashback',
      amount,
      currency: 'NPR',
      status: 'completed',
      description: `Cashback from order ${orderId}`,
      descriptionNepali: `अर्डर ${orderId} बाट क्यासब्याक`,
      orderId,
      paymentMethod: 'wallet',
      fees: 0,
      timestamp: new Date().toISOString(),
      category: 'food'
    };

    this.transactions.unshift(transaction);
    this.walletData.balance += amount;
    this.walletData.cashbackEarned += amount;

    this.saveData();
    return transaction;
  }

  static withdrawMoney(amount: number, method: string): WalletTransaction | null {
    if (this.getAvailableBalance() < amount) {
      return null; // Insufficient balance
    }

    const transaction: WalletTransaction = {
      id: `txn_${Date.now()}`,
      type: 'payout',
      amount,
      currency: 'NPR',
      status: 'pending',
      description: `Withdrawal to ${method}`,
      descriptionNepali: `${method} मा झिकावट`,
      paymentMethod: method,
      fees: amount * 0.015,
      timestamp: new Date().toISOString(),
      category: 'transfer'
    };

    this.transactions.unshift(transaction);
    this.walletData.balance -= amount;
    this.walletData.pendingPayouts += amount;

    this.saveData();
    return transaction;
  }

  static redeemLoyaltyPoints(points: number, rewardValue: number): boolean {
    if (this.walletData.loyaltyPoints < points) {
      return false;
    }

    this.walletData.loyaltyPoints -= points;
    this.walletData.balance += rewardValue;

    const transaction: WalletTransaction = {
      id: `txn_${Date.now()}`,
      type: 'reward',
      amount: rewardValue,
      currency: 'NPR',
      status: 'completed',
      description: `Loyalty points redeemed (${points} points)`,
      descriptionNepali: `लोयल्टी अंकहरू रिडिम गरियो (${points} अंक)`,
      paymentMethod: 'points',
      fees: 0,
      timestamp: new Date().toISOString(),
      category: 'other'
    };

    this.transactions.unshift(transaction);
    this.saveData();
    return true;
  }

  static getTransactions(limit?: number): WalletTransaction[] {
    return limit ? this.transactions.slice(0, limit) : [...this.transactions];
  }

  static getTransactionsByType(type: WalletTransaction['type']): WalletTransaction[] {
    return this.transactions.filter(t => t.type === type);
  }

  static getTransactionsByCategory(category: WalletTransaction['category']): WalletTransaction[] {
    return this.transactions.filter(t => t.category === category);
  }

  private static getCashbackRate(): number {
    switch (this.walletData.accountTier) {
      case 'platinum': return 0.05; // 5%
      case 'gold': return 0.03; // 3%
      case 'silver': return 0.02; // 2%
      default: return 0.01; // 1%
    }
  }

  private static autoReload(): void {
    this.addMoney(
      this.walletData.autoReloadAmount,
      'auto_reload',
      'Auto-reload triggered'
    );
  }

  static updateSettings(updates: Partial<WalletData>): void {
    this.walletData = { ...this.walletData, ...updates };
    this.saveData();
  }

  static freezeAmount(amount: number, reason?: string): boolean {
    if (this.walletData.balance < amount) {
      return false;
    }

    this.walletData.frozenAmount += amount;
    this.saveData();
    return true;
  }

  static unfreezeAmount(amount: number): void {
    this.walletData.frozenAmount = Math.max(0, this.walletData.frozenAmount - amount);
    this.saveData();
  }

  static getSpendingAnalytics(): {
    dailyAverage: number;
    weeklyAverage: number;
    monthlyTotal: number;
    categoryBreakdown: Record<string, number>;
    topSpendingDays: string[];
  } {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const monthlyTransactions = this.transactions.filter(t => {
      const date = new Date(t.timestamp);
      return date.getMonth() === thisMonth && 
             date.getFullYear() === thisYear && 
             t.type === 'payment';
    });

    const categoryBreakdown: Record<string, number> = {};
    monthlyTransactions.forEach(t => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
    });

    return {
      dailyAverage: this.walletData.monthlySpending / 30,
      weeklyAverage: this.walletData.monthlySpending / 4,
      monthlyTotal: this.walletData.monthlySpending,
      categoryBreakdown,
      topSpendingDays: [] // Simplified for now
    };
  }

  private static saveData(): void {
    localStorage.setItem('kisanconnect:wallet', JSON.stringify(this.walletData));
    localStorage.setItem('kisanconnect:transactions', JSON.stringify(this.transactions));
  }

  static loadData(): void {
    const savedWallet = localStorage.getItem('kisanconnect:wallet');
    const savedTransactions = localStorage.getItem('kisanconnect:transactions');

    if (savedWallet) {
      this.walletData = { ...this.walletData, ...JSON.parse(savedWallet) };
    }

    if (savedTransactions) {
      this.transactions = JSON.parse(savedTransactions);
    }
  }

  static resetMonthlySpending(): void {
    this.walletData.monthlySpending = 0;
    this.saveData();
  }

  static getTierBenefits(tier: WalletData['accountTier']): {
    cashbackRate: number;
    creditLimit: number;
    freeDeliveries: number;
    prioritySupport: boolean;
  } {
    switch (tier) {
      case 'platinum':
        return {
          cashbackRate: 5,
          creditLimit: 100000,
          freeDeliveries: -1, // Unlimited
          prioritySupport: true
        };
      case 'gold':
        return {
          cashbackRate: 3,
          creditLimit: 50000,
          freeDeliveries: 10,
          prioritySupport: true
        };
      case 'silver':
        return {
          cashbackRate: 2,
          creditLimit: 25000,
          freeDeliveries: 5,
          prioritySupport: false
        };
      default:
        return {
          cashbackRate: 1,
          creditLimit: 10000,
          freeDeliveries: 2,
          prioritySupport: false
        };
    }
  }
}

// Initialize wallet data
WalletManager.loadData();

export default WalletManager;