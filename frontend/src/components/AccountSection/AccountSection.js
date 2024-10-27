import React, { useState } from 'react';
import './AccountSection.css';

const AccountSection = ({ casinoData, currentBetAmount, updateCasinoData }) => {
  const [count, setSimulationCount] = useState(50);
  const [performSimulation, setPerformSimulation] = useState(false);
  const [simulationData, setSimulationData] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const handleCount = (e) => {
    const newCount = parseInt(e.target.value, 10);
    setSimulationCount(isNaN(newCount) ? "" : newCount);
  }
  const handleDecision = (e) => {
    setPerformSimulation(e.target.checked);
  }

  const clearSimulationData = () => {
    setSimulationData(null);
  }

  const simulate = async () => {
    setIsSimulating(true);
    setTimeout(async () => {
      try {
        const payload = JSON.stringify({ count, betAmount: currentBetAmount });
        const response = await fetch(`${process.env.REACT_APP_API_URL}/casino/sim`, {
          method: 'POST',
          body: payload,
          headers: { 'Content-Type': 'application/json' },
        });

        const responseData = await response.json();
        console.log("responsesim", responseData);
        setSimulationData({
          netResult: responseData.netResult,
          totalWinnings: responseData.totalWinnings
        });

        updateCasinoData(responseData.casinoData);

      } catch (error) {
        console.error("Error fetching spin results:", error);
      } finally {
        setIsSimulating(false);
      }
    }, 2000)
  }
  return (
    <div className="account-container">
      <h2>Account Overview</h2>
      <div className="wallet-section">
        <h3>Wallet</h3>
        <p><strong>Current Amount:</strong> $<span id="current-amount">{casinoData.wallet.currentAmount}</span></p>
        <p><strong>Total Winnings:</strong> $<span id="total-winnings">{casinoData.wallet.totalWinnings}</span></p>
        <p><strong>Total Losses:</strong> $<span id="total-losses">{casinoData.wallet.totalLosses}</span></p>
      </div>
      <div className="game-section">
        <h3>Game Stats</h3>

        <p style={{ color: 'red', textDecoration: 'underline', margin: '10px', padding: '10px' }}>Current Bet: {currentBetAmount}</p>

        <p><strong>Total Spins:</strong> <span id="total-spins">
          {casinoData.game.totalSpins}(W:{casinoData.game.totalSpins-casinoData.wallet.totalLosses/currentBetAmount})(L:{casinoData.wallet.totalLosses/currentBetAmount})
          </span></p>
        <p><strong>Total Bets:</strong> $<span id="total-bets">{casinoData.game.totalBets}</span></p>
        <p><strong>RTP(pct.):</strong> %<span id="rtp">{casinoData.game.rtp}</span></p>

        <div className={`${!simulationData && 'hide-section '}`}>
          <hr />
          <h3>Simulation Data</h3>
          <p><strong>Total Winnings:</strong> $<span >{simulationData && simulationData.totalWinnings}</span></p>
          <p><strong>Net Result:</strong> $<span >{simulationData && simulationData.netResult}</span></p>
          <button onClick={clearSimulationData}>Clear</button>
          <hr />
        </div>
      </div>
      <div className='simulation-section'>
        <div className='simulation-decision'>
          <label htmlFor='simulation-checkBox'>Perform Simulation?</label>
          <input
            id='simulation-checkBox'
            type="checkbox"
            checked={performSimulation}
            onChange={handleDecision}
          />
        </div>
        <div className={`simulation ${!performSimulation && 'hide-section'}`}>
          <input id='autoSpinCount' type='text' onChange={handleCount} value={count} />
          <button disabled={isSimulating} onClick={simulate}>{isSimulating ? 'Please wait...' : 'Simulate'}</button>
        </div>
      </div>
    </div>

  )
}

export default AccountSection
