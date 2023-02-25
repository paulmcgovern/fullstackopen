import { useState } from 'react'

import Buttons from './Buttons'
import Statistics from './Statistics'

const App = () => {

  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>

      <h1>Give Feedback</h1>

      <Buttons good={() => setGood(good + 1)} 
               neutral={() => setNeutral(neutral + 1)}
               bad={() => setBad(bad + 1)} />

      <h1>Statistics</h1>

      <Statistics good={good} neutral={neutral} bad={bad} naMsg="No feedback given" />

    </div>
  )
}

export default App

