const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const CasinoGame = require('./services/casino-game');
const { Account } = require('./services/account');
const port = process.env.PORT || 5252;

app.use(cors());

app.use(bodyParser.json());

const account = new Account(100);
const casino = new CasinoGame(3, 3, account);

app.get('/api/casino/', (req, res) => {
  res.json({
    message: "Welcome to WIENER CASINO",
    casinoData: casino.account.getSummary(),
  });

});

app.post('/api/casino/play', (req, res) => {
  const { betAmount } = req.body;
  let { winnings, matrix } = casino.bet(betAmount);

  res.json({
    winnings,
    matrix,
    casinoData: casino.account.getSummary(),
  })
})

app.post('/api/casino/sim', (req, res) => {
  const { count, betAmount } = req.body;

  for (let i = 0; i < count; i++) {
    casino.bet(betAmount);
  }
  const data = casino.account.calculateSimulation();
  
  res.json({
    ...data,
    casinoData: casino.account.getSummary(),
  });
});

app.get('/api/casino/rtp', (req, res) => {
  
  res.json({ rtp: casino.account.calculateRTP() });
})

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
