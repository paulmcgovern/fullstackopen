
const CountryList = ({countries, maxItems, showHandler}) => {

    if(!countries){
        return
    }

    if(countries.length >= maxItems) {
        return (<div>Too many matches, specify another filter.</div>)
    }

    const rendered = countries.map((country, idx) => 
        <li key={`country_${idx}`}>{country.name.common} 
        <button onClick={() => showHandler(country)}>Show</button></li>
    )

    return (<ul>{rendered}</ul>)	
}

export default CountryList

