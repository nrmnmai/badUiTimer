import React, { useState, useEffect, useRef } from 'react';
import TimerDisplay from './Index.jsx'; 
import './App.css'; 

const App = () => {
  const MIN_DURATION = 1000; 
  const MAX_DURATION = 365 * 24 * 60 * 60 * 1000;
  const [sliderValue, setSliderValue] = useState(MIN_DURATION);
  const [timeRemaining, setTimeRemaining] = useState(0); 
  const [isRunning, setIsRunning] = useState(false);
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const intervalRef = useRef(null); 

  const startTimer = () => {
    // We only set timeRemaining here if it hasn't been set yet, or if it's 0
    if (timeRemaining === 0 || !isTimerVisible) {
        setTimeRemaining(sliderValue); 
    }
    setIsTimerVisible(true);
    
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1000) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000); 

      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };
  
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeRemaining(0); 
    setIsTimerVisible(false); // Go back to the initial state
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="App">
      <h1>Very good timer</h1>

      <input
        type="range"
        min={MIN_DURATION}
        max={MAX_DURATION}
        value={sliderValue}
        onChange={(e) => setSliderValue(Number(e.target.value))}
        className="timer-slider"
      />

      {isTimerVisible && <TimerDisplay time={timeRemaining} />}
      
      <div className="button-group">

        {/* CONDITION UPDATED: This button shows if we are paused OR haven't started yet */}
        {(!isRunning) && (
          <button 
              className={`setTimerButton ${isTimerVisible ? 'success' : 'primary'}`} 
              onClick={startTimer}>
            {isTimerVisible ? 'Continue' : 'Start Timer'}
          </button>
        )}
        
        {/* This button only shows if the timer is actively running */}
        {isRunning && (
          <button className="PauseStartButton danger" onClick={pauseTimer}>
            Pause
          </button>
        )}

        {/* The Reset Button should show whenever the timer has been made visible */}
        {isTimerVisible && (
          <button className="ResetButton" onClick={resetTimer}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
