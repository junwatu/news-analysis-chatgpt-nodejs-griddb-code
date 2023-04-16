import { useState } from 'react'
import News from './News'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <News/>
    </div>
  )
}

export default App
