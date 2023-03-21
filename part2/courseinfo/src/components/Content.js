import Part from './Part'

const Content = ({parts}) => {

    return(
        parts.map(part => <Part part={part}/>)
    )
}

export default Content
