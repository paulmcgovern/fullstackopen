
// deets
const CountryDetail = ({country}) => {

    if(!country){
        return 
    }

  
    return (<div>
        <h2>{country.name.common}</h2>

        <div>Capital: {country.capital[0]}</div>
        <ul>
            <li>Area: {country.area.toLocaleString()} km<sup>2</sup>
            </li>
            <li>
                <h3>Languages:</h3>
                <ul>
                    {Object.keys(country.languages).map((k, idx) => <li key={"lang_" + idx}>{country.languages[k]}</li>)}
                </ul>
            </li>
        </ul>   
        <div>
            <img src={country.flags.png} alt="Flag"/>   
        </div>    
    </div>)
}

export default CountryDetail
