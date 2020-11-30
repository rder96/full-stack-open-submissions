import React from 'react';

const Header = ({ name }) => {
  return (
    <h2>{name}</h2>
  )
}
  
const Content = ({ parts }) => {
  return (
    <div>
      {parts.map( (x) => { 
        return <Part key={x.id} part={x} />
      })}
    </div>
  )
}
  
const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>    
  )
}
  
const Total = ({ parts }) => {
  const sum = parts.reduce((sum, part) => { 
    return sum + part.exercises
  }, 0)
  return(
    <b>total of {sum} exercises</b>
  ) 
}
  
const Course = ({ course }) => { 
  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  )
}

export default Course