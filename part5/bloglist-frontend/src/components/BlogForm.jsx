const BlogForm = ({
  formHandler,
  blogTitle,
  blogAuthor,
  blogUrl,
  blogTitleChangeHandler,
  blogAuthorChangeHandler,
  blogUrlChangeHandler
}) => {

  return (
    <div>
      <h2>Create New</h2>
      <form onSubmit={formHandler}>
        <table>
          <tbody>
          <tr>
            <td>Title:</td>
            <td>
              <input id='blogTitle' 
                     value={blogTitle || ''}
                     onChange={blogTitleChangeHandler} />
             </td>
          </tr>
          <tr>
            <td>Author:</td>
            <td>
              <input id='author' 
                     value={blogAuthor || ''}
                     onChange={blogAuthorChangeHandler} />
             </td>
          </tr>
          <tr>
            <td>URL:</td>
            <td>
              <input id='blogUrl'
                     value={blogUrl || ''}
                     onChange={blogUrlChangeHandler} />
            </td>
          </tr>
          </tbody>
        </table>
        <button type='submit'>Create</button>
      </form>
    </div>
  )
}

export default BlogForm
