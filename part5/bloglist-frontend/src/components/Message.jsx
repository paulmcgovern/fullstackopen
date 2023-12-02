
import PropTypes from 'prop-types'

const Message = ({ message, isError }) => {

  if(!message){
    return
  }

  const className = isError? 'error' : 'message'

  return (<div className={className}>{message}</div>)

}

Message.propTypes = {
  message: PropTypes.string.isRequired,
  isError: PropTypes.bool.isRequired
}

export default Message
