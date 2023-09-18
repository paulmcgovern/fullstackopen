import { useState, useEffect } from 'react'
import Lookup from './components/Lookup'
import Message from './components/Message'
import CountryList from './components/CountryList'
import CountryDetail from './components/CountryDetail'
import CapitalWeather from './components/CapitalWeather'

import countriesService from './services/Countries'
import weatherService from './services/Weather'

const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY

function App() {

  const [lookup, setLookup] = useState('')
  const [countries, setCountries] = useState([])
  const [message, setMessage] = useState()
  const [detailCountry, setDetailCountry] = useState()
  const [currentWeather, setCurrentWeather] = useState()
  const [filteredCountries, setFilteredCountries] = useState([])

  const handleLookupChange = (event) => {

    setLookup(event.target.value)

    let filtered = countries.filter(country => {
    
      if(!country || !country.name || !country.name.common){
          return false
      }
      return country.name.common.toUpperCase().includes(lookup.toUpperCase())

    })
  
    if(filtered.length === 1){

      setDetails(filtered[0])  

    } else {

      setDetails(undefined)
      filtered = filtered.sort((c1, c2) => c1.name.common.localeCompare(c2.name.common))
    }

    setFilteredCountries(filtered)
  }

  const countriesHook = () => {
    countriesService.getAllCountries()
      .then(allCountries => {
        if(allCountries === undefined){
          setMessage("Failed to get master list of countries.")
        } else {
          setCountries(allCountries)
          setMessage(undefined)
        }
      })
  }

  const showHandler = (country) => {
    setDetails(country)
  }


  const setDetails = (country) => {

    setDetailCountry(country) 

    if(country) {

      // Get capital coordinates to
      // pass to weather service.
      let latitude = country.capitalInfo.latlng[0]
      let longitude = country.capitalInfo.latlng[1]
      
      weatherService.getCurrentByLatLong(WEATHER_API_KEY, latitude, longitude).then(
        weatherResp => {
          if(weatherResp === undefined){
            setMessage("Failed to get current weather.")
          } else {            
            setCurrentWeather(weatherResp)
            setMessage(undefined)
          }
        }
      )
    } else {

      setCurrentWeather(undefined)
    }
  
  }
  
  // Load initial list of People
  useEffect(countriesHook, [])

  return (
    <div>
    <div>Find Countries
      <Lookup lookup={lookup} changeHandler={handleLookupChange} />
    </div>
    <div>
      <Message message={message} />
    </div>
    <div>
      <CountryList countries={filteredCountries} maxItems={10} showHandler={showHandler} />
    </div>
    <div> 
      <CountryDetail country={detailCountry} />
    </div>
    <div>
      <CapitalWeather country={detailCountry} current={currentWeather} />
    </div>
    </div>
  );
}

   
export default App;
