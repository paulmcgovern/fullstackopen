import Content from './Content'
import Header from './Header'
import Total from './Total'

const Course = ({course}) => {

    return(
        <div id={"course_" + course.id}>
            <Header text={course.name}/>
            <Content parts={course.parts} />
            <Total course={course} />
        </div>
    )

}

export default Course
