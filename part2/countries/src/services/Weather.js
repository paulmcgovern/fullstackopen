import axios from 'axios'

const WEATHER_SERVICE = "https://api.weatherapi.com/v1/current.json"

const getCurrentByLatLong = (apiKey, latitude, longitude) => {

    let url = `${WEATHER_SERVICE}?key=${apiKey}&q=`
    url += encodeURIComponent(`${latitude},${longitude}`)

    const request = axios.get(url)

    return request.then(response => {
        return response.data

    }).catch(error => {

        console.log("Error getting countries", error)
        return undefined
    })
}

export default { getCurrentByLatLong }
