import Header from './Header';
import Total from './Total';
import Part from './Part';

const App = () => {

  const course = 'Half Stack application development'

  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header text={course} />

      <Part parts={parts} /> 

      <Total parts={parts}/>

    </div>
  )
}

//Header, Content, and Total. 

export default App;
