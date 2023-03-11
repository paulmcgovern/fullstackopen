
import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [mostPopular, setMostPopular] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  // Update the votes and find the 
  // most popular item.
  const handleVote = () => {
  
    const updatedArr = votes.map((val, idx) => {
      if (idx === selected) {
        return val + 1
      } 
      return val
    });

    // Get most popular, by votes
    const mostPopular = updatedArr.reduce((maxIdx, curVal, curIdx, arr) =>
                                           curVal > arr[maxIdx] ? curIdx: maxIdx, 0)

    setVotes(updatedArr)
    setMostPopular(mostPopular)
  }

  // Update selected anecdote to
  // next ransom item.
  const handleNext = () => {
    const nextSelection = Math.floor(Math.random() * anecdotes.length)
    setSelected(nextSelection);
  }

  return (
    <div>
      <p>{anecdotes[selected]}</p>
      <div><button onClick={handleVote}>Vote</button>
      <button onClick={handleNext}>Next Anecdote</button></div>
      <p>has {votes[selected]} votes</p>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[mostPopular]}</p>
    </div>
  )
}

export default App

