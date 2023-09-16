
const PersonList = ({personList, filter, handleDelete}) => {

    if(!personList){
        return
    }

    // Confirm deletion request.
    // Send to handler to perform
    // the deletion.
    const confirmDelete = (person) => {

        if(window.confirm(`Delete ${person.name}?`)){
            handleDelete(person) 
        }
    }


    let filteredList

    // If a filter has been defined, apply it 
    // as a prefix filter to person names
    if(filter) {

        const filterUc = filter.toUpperCase()

        filteredList = personList.filter(person => {

            if(!person || !person.name ) {
                return false
            }

            return person.name.toUpperCase().startsWith(filterUc)
        })

    } else {
        filteredList = personList
    }

    if(filteredList.length === 0) {
        return
    }

    const rendered = filteredList.map((person) => 
        <li key={"person_" + person.id}>{person.name} {person.number}
        <button onClick={() => confirmDelete(person)}>Delete</button></li>
    )
    
    return (<ul>{rendered}</ul>)
}

export default PersonList
