import Header from './Header';
import Total from './Total';
import Part from './Part';

const App = () => {

  const course = {
    name: 'Half Stack application development',
    parts: [
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
  }

  return (
    <div>
      <Header course={course} />

      <Part course={course} /> 

      <Total course={course}/>

    </div>
  )
}

//Header, Content, and Total. 

export default App;
