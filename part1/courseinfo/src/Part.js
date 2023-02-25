
const Part = (props) => {

    return (props.course.parts.map((pt, idx) => <p key={idx}>{pt.name} {pt.exercises}</p>))
   
}

export default Part
