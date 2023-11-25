
const Message = ({message, isError}) => {

    if(!message){
        return
    }

    const className = isError? "error" : "message"

    return (<div className={className}>{message}</div>)
  
  }
  
  export default Message
  