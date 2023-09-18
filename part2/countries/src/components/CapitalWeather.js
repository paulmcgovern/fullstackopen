
const CapitalWeather = ({country, current}) => {

    if(!country || !current){
        return 
    }

    let icon = "https://" + current.current.condition.icon

    return(
        <div>
        <h3>Weather in {country.capital[0]}</h3>
        <div>temperature {current.current.temp_c} Celcius</div>
        <img src={icon} alt={current.current.condition.text} />
        <div>wind {current.current.wind_kph} kph</div>
        </div>
    ) 
}

export default CapitalWeather

