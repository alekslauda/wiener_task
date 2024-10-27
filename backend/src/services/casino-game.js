
const { Random } = require("random-js");

const ROW_WITH_PREDEFINED_SYMBOLS = ['SYMBOL_1','SYMBOL_2','SYMBOL_3','SYMBOL_4','SYMBOL_5'];


const WIN_MULTIPLIER = 5;


class CasinoGame {
  constructor(row, col, account) {
    this.randomJs = new Random();
    this.row = row;
    this.col = col;
    this.defaultMatrix = [];
    this.matrix = [];
    this.account = account;
    this.init();
  }

  init() {
    for (let i = 0; i < this.row; i++) {
      this.defaultMatrix[i]=[]
      for (let j = 0; j < ROW_WITH_PREDEFINED_SYMBOLS.length; j++) {
        
        let shuffled = this.randomJs.shuffle(ROW_WITH_PREDEFINED_SYMBOLS);
        let addSymbol = this.randomJs.pick(shuffled);
        this.defaultMatrix[i][j] = addSymbol
      }
    }
  }

  bet(amount) {
    this.init();
    this.account.wallet.placeBet(amount);
    this.account.casinoStats.recordBet(amount);
    this.matrix = this.defaultMatrix.map(row => this.randomJs.sample(row, 3));
    console.log("this.defaultMatrix", this.defaultMatrix)
    console.log("this.matrix", this.matrix)

    const winnings = this.calculateWinnings(amount);
    if (winnings.some(amount => amount > 0)) {
      this.account.wallet.addWinnings(winnings.reduce((sum, val) => sum + val, 0));
    } else {
      this.account.wallet.addLoss(amount);
    }

    this.account.calculateRTP()

    return {
      winnings,
      matrix: this.matrix,
    };
  }

  calculateWinnings(amount) {

    let winnings = new Array(3).fill(0);
    
    for (let i = 0; i < winnings.length; i++) {
      if (this.matrix[i][0] === this.matrix[i][1] && this.matrix[i][1] === this.matrix[i][2]) {
        winnings[i] = amount * WIN_MULTIPLIER;
      }
    }

    return winnings;
  }

  getMatrix() {
    return this.matrix;
  }
}

module.exports = CasinoGame; 
