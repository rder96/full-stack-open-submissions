import React, { useState, useEffect} from 'react'
import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY

const Finder = ( {search, setSearch, result} ) => {   
  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  return (
    <>
      <div>find countries<input search={search} onChange={handleSearchChange} /></div>
    </> 
  )
}

const Display = ( {countries, search} ) => {  
  if (search === '') {
    return (<></>)
  } 
  if (countries.length === 0) { 
    return (
      <>
        {console.log('no match')}
      </>
    )
  } else if (countries.length === 1) {
    return (
      <>
        <View country={countries[0]} />
      </>
    )
  } else if (countries.length > 10 ) { 
    return (
      <>
       <div>Too many matches, specify another filter</div>
      </>
    )
  } else { 
    return (
      <>
        {countries.map(x => <Country key={x.name} country={x} />)}
      </>
    )
  }
}

const Country = ( {country} ) => {
  const [viewShown, setViewShown] = useState(false)
  
  const handleClick = () => { 
    setViewShown(true)
  }

  return (
    <>
      <div>{country.name}<button onClick={handleClick}>Show</button></div>
      {viewShown && <View country={country} />}
    </>
  )
}

const View = ( {country} ) => {
  return (
    <>
      <h2>{country.name}</h2>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h3>languages</h3>
      <ul>
        {country.languages.map(x => <li key={x.name}>{x.name}</li>)}
      </ul>
      <img src={country.flag} alt="country's flag" width='150px' />
      <h3>Weather in {country.capital}</h3>
      <Weather capital={country.capital} />
    </>
  )
}

const Weather = ( {capital} ) => { 
  const [result, setResult] = useState([])

  useEffect(() => {
    axios
      .get('http://api.weatherstack.com/current', {params: {
        access_key: api_key, 
        query: capital,
        units: 'm'
      }})
      .then(response => {
        setResult(response.data['current'])
      })
  }, [capital]) 

  return (
    <>
      <div><b>temperature: </b>{result.temperature} Celcius</div>
      <img src={result.weather_icons} alt={result.weather_descriptions} width='75px' height='75px' />
  <div><b>wind: </b>{Math.floor(result.wind_speed * 0.621371)} mph direction {result.wind_dir}</div>
    </>
  )
}

function App() {
  const [search, setSearch] = useState('')
  const [result, setResult] = useState([

  ])

  useEffect( () => {
    console.log('effect')
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
         setResult(response.data)
      })
  }, [])

  return (
    <>
      <Finder search={search} setSearch={setSearch} result={result} />
      <Display countries={result.filter(x => (x.name).toLowerCase().startsWith(search))} search={search} />
    </>
  )
}

export default App;
