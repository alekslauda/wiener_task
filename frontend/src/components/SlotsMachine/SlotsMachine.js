import React, { useState, useEffect } from 'react';
import './SlotsMachine.css';

const symbolsHash = {
  'SYMBOL_1': '🐒',
  'SYMBOL_2': '🙉',
  'SYMBOL_3': '🙈',
  'SYMBOL_4': '🐵',
  'SYMBOL_5': '🙊',
};

const symbols = Object.keys(symbolsHash)
const INIT_AUTOSPIN_COUNT = 50;
const INIT_BET_AMOUNT = 50;
const INIT_WINNINGS = [0, 0, 0];

const SlotsMachine = ({ onCasinoDataUpdate, onBetAmountUpdate }) => {
  const [matrix, setMatrix] = useState([
    Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]),
    Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]),
    Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]),
  ]);
  const [winnings, setWinnings] = useState(INIT_WINNINGS)
  const [isSpinning, setIsSpinning] = useState(false);
  const [autoSpinCount, setAutoSpinCount] = useState(INIT_AUTOSPIN_COUNT);
  const [betAmount, setBetAmount] = useState(INIT_BET_AMOUNT);
  const [autoSpinChecked, setAutoSpinChecked] = useState(false);

  useEffect(() => {
    let autoSpinInterval;

    if (autoSpinChecked && autoSpinCount > 0) {
      autoSpinInterval = setInterval(() => {
        if (!isSpinning) {
          handleSpin();
        }
      }, 1500); 
    }

    return () => clearInterval(autoSpinInterval);
  }, [autoSpinChecked, autoSpinCount, isSpinning]);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinnings(INIT_WINNINGS);

    setTimeout(async () => {
      const payload = JSON.stringify({ betAmount });
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/casino/play`, {
          method: 'POST',
          body: payload,
          headers: { 'Content-Type': 'application/json' },
        });

        const responseData = await response.json();
        console.log("responseDAta", responseData);
        setMatrix(responseData.matrix);
        onCasinoDataUpdate(responseData.casinoData);
        setWinnings(responseData.winnings);

        if (autoSpinChecked) {
          setAutoSpinCount((prevCount) => {
            if (prevCount <= 1) {
              setAutoSpinChecked(false);
              return INIT_AUTOSPIN_COUNT;
            }
            return prevCount - 1;
          });
        }
      } catch (error) {
        console.error("Error fetching spin results:", error);
      } finally {
        setIsSpinning(false);
      }
    }, 2000);
  };

  const handleSingleSpin = () => {
    if (!isSpinning) {
      handleSpin();
    }
  };

  const handleBetAmount = (e) => {
    const bet = parseInt(e.target.value, 10);
    const currentBetAmount = isNaN(bet) ? "" : bet;
    setBetAmount(currentBetAmount);
    onBetAmountUpdate(currentBetAmount);
  };

  const handleAutoSpinCount = (e) => {
    const newCount = parseInt(e.target.value, 10);
    setAutoSpinCount(isNaN(newCount) ? "" : newCount);
  };

  const handleAutoSpinCheck = (e) => {
    setAutoSpinChecked(e.target.checked);
  };

  const isWinRow = (rowIndex) => {
    return winnings[rowIndex] !== 0
  };

  return (
    <div className="slots-machine">
      <div className='slots-machine__actions-betAmount'>
        <label htmlFor='betAmount'>BET AMOUNT:</label>
        <input id='betAmount' type='text' onChange={handleBetAmount} value={betAmount} />
      </div>

      <div className="matrix-container">
        {matrix.map((col, colIndex) => (
          <React.Fragment key={colIndex}>
            <div className={`column ${isSpinning ? 'spinning' : ''}`}>
              {matrix.map((row, rowIndex) => (
                <div key={rowIndex} className={`symbol ${isWinRow(rowIndex) ? 'winner' : ''}`}>
                  {symbolsHash[matrix[rowIndex][colIndex]]}
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className='slots-machine__actions'>
        {!autoSpinChecked && (
          <button onClick={handleSingleSpin} disabled={isSpinning}>
            {isSpinning ? 'Spinning...' : 'Single Spin'}
          </button>
        )}

        <div className='slots-machine__actions--autoSpin'>
          <div className='slots-machine__actions-autoSpinCount'>
            <label htmlFor='autoSpinCount'>SET AUTOSPIN COUNT:</label>
            <input id='autoSpinCount' type='text' onChange={handleAutoSpinCount} value={autoSpinCount} />
          </div>

          <div className="slots-machine__actions--autoSpinCheckBox">
            <input
              type="checkbox"
              id="autoSpinCheckBox"
              checked={autoSpinChecked}
              onChange={handleAutoSpinCheck}
            />
            <label htmlFor="autoSpinCheckBox">
              <div className="tick_mark"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotsMachine;
