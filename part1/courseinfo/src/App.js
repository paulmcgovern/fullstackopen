import Header from './Header';
import Total from './Total';
import Part from './Part';

const App = () => {

  const course = 'Half Stack application development'

  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }

  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }

  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      <Header text={course} />

      <Part part={part1} />
      <Part part={part2} />
      <Part part={part3} /> 

      <Total total={part1.exercises + part2.exercises + part3.exercises}/>

    </div>
  )
}

//Header, Content, and Total. 

export default App;
