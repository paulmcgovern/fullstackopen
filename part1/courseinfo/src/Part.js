
const Part = (props) => {

    return (props.parts.map((pt, idx) => <p key={idx}>{pt.name} {pt.exercises}</p>))
   
}

export default Part
