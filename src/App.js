import React, { useEffect, useState } from 'react';
import './App.css';
import {
  MenuItem,
  Select,
  FormControl,
  Card,
  CardContent
} from '@material-ui/core';
import InfoBox from './InfoBox';
import Table from './Table';
import {sortData} from './util';
import LineGraph from './LineGraph';

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map(country => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ))
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries); 
        })
    }
    getCountriesData();
  }, [])

  useEffect(async () => {
    await fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      })
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    
    const url = countryCode === 'worldwide' ? 
    'https://disease.sh/v3/covid-19/all' :
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then(response => response.json())
    .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  }


  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 Statistics</h1>
          <FormControl className='app__dropdown'>
            <Select
              variant='outlined'
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value='worldwide' key='worldwide'>Worldwide</MenuItem>
              {
                countries.map(country => {
                  return (
                    <MenuItem value={country.value} key={country.value}>{country.name}</MenuItem>
                  )
                })
              }
            </Select>

          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox title='Coronavirus Cases' total={countryInfo.cases} cases={countryInfo.todayCases} type='cases' />
          <InfoBox title='Recovered' total={countryInfo.recovered} cases={countryInfo.todayRecovered} type='recovered' />
          <InfoBox title='Deaths' total={countryInfo.deaths} cases={countryInfo.todayDeaths} type='deaths' />
        </div>
        <LineGraph country={country} />
      </div>
      <div className="app__right">
        <Card>
          <CardContent>
            <h3>Live cases by Country</h3>
            <Table countries={tableData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
