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
        <a href="https://www.felipelecot.com/" target="_blank">
          <img src="https://imgs.search.brave.com/gN2IWLnVa4u0-Rpr2rh_fDIBlSwDO3YXcJkcwfJ70SY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nbWFydC5jb20v/ZmlsZXMvMjMvRjEt/TG9nby1QTkctUGhv/dG9zLnBuZw"
            className="logo" alt="Vite logo" style={{ transform: `rotate(${count * 30}deg)` }} />
        </a>
        <a href="https://www.felipelecot.com/" target="_blank">
          <img src="https://imgs.search.brave.com/NwUOcikn9_BuZPatFkzhurOz5NPJNmy5BYmh4sbXpHA/rs:fit:860:0:0:0/g:ce/aHR0cDovL3R5cmUt/YXNzZXRzLnBpcmVs/bGkuY29tL3N0YXRp/Y2ZvbGRlci9UeXJl/L3Jlc291cmNlcy9p/bWcveWVsbG93LXBh/cmVudGVzaS5wbmc"
            className="logo react" alt="React logo" />
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
