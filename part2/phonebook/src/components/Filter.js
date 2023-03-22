
const Filter = ({filter, changeHandler}) => {

  return (
    <div>
      filter shown with <input value={filter} onChange={changeHandler} />
    </div>)

}

export default Filter
