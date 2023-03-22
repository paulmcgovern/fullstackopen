

const PersonList = ({personList, filter}) => {

    if(!personList){
        return
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

    const rendered = filteredList.map((person, idx) => 
        <li key={"person_" + idx}>{person.name} {person.number}</li>
    )
    
    return (<ul>{rendered}</ul>)
}

export default PersonList
