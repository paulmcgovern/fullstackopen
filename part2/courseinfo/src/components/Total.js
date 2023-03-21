
const Total = ({course}) => {

    let total = course.parts.reduce((acc, pt) => {return acc + pt.exercises}, 0)

    return (        
        <p><strong>total of {total} exercises</strong></p>
    )
}

export default Total
