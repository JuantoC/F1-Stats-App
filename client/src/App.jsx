import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CarRacersList from './ListCarRacers'
import ResultsList from './ListResults'

function App() {
  const [count, setCount] = useState(0)

  const getCounterLabel = (num) => {
    if (num === 1) return `${num}st`;
    if (num === 2) return `${num}nd`;
    if (num === 3) return `${num}rd`;
    return `${num}th`;
  };

  const counter = getCounterLabel(count + 1);
  return (
    //imgs
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" style={{ transform: `rotate(${count * 30}deg)` }} />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h2>Racers</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          {counter} page
        </button>
        <CarRacersList limit={count} />

      </div>
    </>
  )
}

export default App
