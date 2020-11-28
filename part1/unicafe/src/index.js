import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const DisplayMenu = ({ title }) => { 
  return (
    <>
      <h2>{title}</h2>
    </>
  )
}

const Statistics = ( {title, good, neutral, bad} ) => { 
  const all = good + neutral + bad
  const ave = (good*1 + neutral*0 + bad*-1) / all
  const pos = ((good/all) * 100)+ '%' 
  if (all === 0) { 
    return (
      <>
        <h2>{title}</h2>
        <div>No feedback given</div>
      </>
    )
  }
  return (
    <>
      <h2>{title}</h2>
      <table>
        <tbody>
          <Statistic text="good" value={good} />
          <Statistic text="neutral" value={neutral} />
          <Statistic text="bad" value={bad} />
          <Statistic text="all" value={all} />
          <Statistic text="average" value={ave} />
          <Statistic text="positive" value={pos} />
        </tbody>
      </table>
    </>
  )
}

const Statistic = ( {text, value} ) => {
  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </>
  )
}

const Button = ( {handleClick, text} ) => { 
  return (
    <>
      <button onClick={handleClick}>{text}</button>
    </>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [reviews, setReviews] = useState({
    good: 0, neutral: 0, bad: 0
  })

  const handleGoodClick = () => 
    setReviews({ ...reviews, good: reviews.good + 1})
  
  const handleNeutralClick = () => 
    setReviews({ ...reviews, neutral: reviews.neutral + 1})

  const handleBadClick = () => 
    setReviews({ ...reviews, bad: reviews.bad + 1})
  
  return (
    <>
      <DisplayMenu title="give feedback" />
      <Button text="good" handleClick={handleGoodClick} />
      <Button text="neutral" handleClick={handleNeutralClick}/>
      <Button text="bad" handleClick={handleBadClick}/>
      <Statistics title="statistics" good={reviews.good} neutral={reviews.neutral} bad={reviews.bad} />
    </>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)