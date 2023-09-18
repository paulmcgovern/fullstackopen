import axios from 'axios'


const COUNTRY_SERVICE = "https://studies.cs.helsinki.fi/restcountries/api"

const getAllCountries = () => {

   const request = axios.get(`${COUNTRY_SERVICE}/all`)

   return request.then(response => {

      return response.data

   }).catch(error => {

         console.log("Error getting countries", error)
         return undefined
   })
}

export default { getAllCountries }

