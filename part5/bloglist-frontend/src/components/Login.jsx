const LoginForm = ({
  formHandler,
  username,
  password,
  usernameChangeHandler,
  passwordChangeHandler
}) => {

  return (
    <div>
      <h2>Log in to applicaiton</h2>
      <form onSubmit={formHandler}>
        <table>
          <tbody>
            <tr>
              <td>Username:</td>
              <td>
                <input id='username'
                  value={username}
                  onChange={usernameChangeHandler} />
              </td>
            </tr>
            <tr>
              <td>Password:</td>
              <td>
                <input type='password'
                  id='password'
                  value={password}
                  onChange={passwordChangeHandler} />
              </td>
            </tr>
          </tbody>
        </table>
        <button type='submit'>Log in</button>
      </form>
    </div>
  )
}

export default LoginForm
