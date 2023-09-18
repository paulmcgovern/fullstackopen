const Lookup = ({filter, changeHandler}) => {

  return (
      <input value={filter} onChange={changeHandler} />
  )
}

export default Lookup

