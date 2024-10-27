
class InsufficientFunds extends Error{
  constructor(message = '"Insufficient funds"') {
    super(message)
  }
}

class Wallet {
  constructor(initialAmount) {
    this.currentAmount = initialAmount;
    this.totalWinnings = 0;
    this.totalLosses = 0;
  }

  placeBet(amount) {
    // if (amount > this.currentAmount) {
    //   // throw new InsufficientFunds();->check
    //   this.currentAmount = 0;
    // } 
      this.currentAmount -= amount;
  }

  addWinnings(winningAmount) {
    this.totalWinnings += winningAmount;
    this.currentAmount += winningAmount;
  }

  addLoss(amount) {
    this.totalLosses += amount;
  }
}


class CasinoStats {
  constructor() {
    this.totalSpins = 0;
    this.totalBets = 0;
  }

  recordBet(amount) {
    this.totalBets += amount;
    this.totalSpins += 1;
  }
}

class Account {
  constructor(initialAmount) {
    this.wallet = new Wallet(initialAmount);
    this.casinoStats = new CasinoStats();
    this.rtp = 0;
  }

  calculateRTP() {
    if (this.casinoStats.totalBets > 0) {
      this.rtp = ((this.wallet.totalWinnings / this.casinoStats.totalBets) * 100).toFixed(2);
    }
    return this.rtp;
  }

  calculateSimulation() {
    return {
      totalWinnings: this.wallet.totalWinnings,
      netResult: this.wallet.totalWinnings-this.casinoStats.totalBets
    }
  }

  getSummary() {
    return {
      wallet : {
        currentAmount: this.wallet.currentAmount,
        totalWinnings: this.wallet.totalWinnings,
        totalLosses: this.wallet.totalLosses,
      },
      game: {
        totalSpins: this.casinoStats.totalSpins,
        totalBets: this.casinoStats.totalBets,
        rtp: this.rtp,
      }
    };
  }
}


exports.Account = Account;
exports.InsufficientFunds = InsufficientFunds;

