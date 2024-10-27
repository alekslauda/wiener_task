import React, { useState, useEffect } from 'react';
import './App.css';
import SlotsMachine from './components/SlotsMachine/SlotsMachine';
import AccountSection from './components/AccountSection/AccountSection';

function App() {
  const [message, setMessage] = useState('');
  const [casinoData, setCasinoData] = useState(null)
  const [currentBetAmount, setcurrentBetAmount] = useState(50)

  useEffect(() => {

    fetch(`${process.env.REACT_APP_API_URL}/casino`)
      .then(response => response.json())
      .then(data => {

        setMessage(data.message);
        setCasinoData(data.casinoData)
      })
      .catch(err => console.error('Error - fetching backend data:', err));
  }, []);

  const updateCasinoData = (newData) => {
    setCasinoData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  const handleCasinoDataUpdate = (updatedData) => {
    setCasinoData(updatedData);
  };

  const handleCurrentBetAmount = (betAmount) => {
    setcurrentBetAmount(betAmount);
  }

  return (
    <div className="app-container">
      <h1 className='animated-heading'>{message ? message : "Loading..."}</h1>
      <div className='game-container'>
        {casinoData && <AccountSection updateCasinoData={updateCasinoData} currentBetAmount={currentBetAmount} casinoData={casinoData}></AccountSection>}
        <SlotsMachine
          onCasinoDataUpdate={handleCasinoDataUpdate}
          onBetAmountUpdate={handleCurrentBetAmount}
        >

        </SlotsMachine>
      </div>

    </div>
  );
}

export default App;
