const Logout = ({
  logoutHandler,
  user
}) => {

  return (
    <div>
    {user.name} logged in <button onClick={logoutHandler}>Logout</button>
    </div>
  )
}

export default Logout