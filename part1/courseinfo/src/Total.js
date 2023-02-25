
const Total = (props) => {

    let total = props.course.parts.reduce((acc, pt) => {return acc + pt.exercises}, 0)

    return (        
        <p>Number of exercises {total}</p>
    )
}

export default Total
