import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Card, CardContent } from '@material-ui/core';
import numeral from "numeral";

// const testData = {
//   labels: ['1', '2', '3', '4', '5', '6'],
//   datasets: [
//     {
//       label: '# of Votes',
//       data: [12, 19, 3, 5, 2, 3],
//       fill: false,
//       backgroundColor: 'rgb(255, 99, 132)',
//       borderColor: 'rgba(255, 99, 132, 0.2)',
//     },
//   ],
// };

// const testOptions = {
//   scales: {
//     yAxes: [
//       {
//         ticks: {
//           beginAtZero: true,
//         },
//       },
//     ],
//   },
// };

// const buildChartData = (data, casesType) => {
//   let chartData = [];
//   let lastDataPoint;
//   for (let date in data[casesType]) {
//     if (lastDataPoint) {
//       let newDataPoint = {
//         x: date,
//         y: data[casesType][date] - lastDataPoint,
//       };
//       chartData.push(newDataPoint);
//     }
//     lastDataPoint = data[casesType][date];
//   }
//   return chartData;
// };

function LineGraph({ country }) {

  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const [labels, setLabels] = useState([]);
  const [cases, setCases] = useState([]);
  const [deaths, setDeaths] = useState([]);
  const [recovered, setRecovered] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = country === 'worldwide' ? 
        'https://disease.sh/v3/covid-19/historical/all?lastdays=30' : 
        `https://disease.sh/v3/covid-19/historical/${country}?lastdays=30`;
      await fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          if (data.message) {
            setError(data.message);
          } else {
            let tempLabels = [];
            let tempCases = [];
            let tempDeaths = [];
            let tempRecovered = [];
            let lastCasesCount;
            let lastDeathsCount; 
            let lastRecoveredCount;
            const timeline = data.timeline || data;
            for(let key in timeline.cases) {
              if (lastCasesCount) {
                tempCases.push(timeline.cases[key] - lastCasesCount);
                tempDeaths.push(timeline.deaths[key] - lastDeathsCount);
                tempRecovered.push(timeline.recovered[key] - lastRecoveredCount);
                tempLabels.push(key)
              }
              lastCasesCount = timeline.cases[key];
              lastDeathsCount = timeline.deaths[key];
              lastRecoveredCount = timeline.recovered[key];
            }
            setError('');
            setData(data);
            setLabels(tempLabels);
            setCases(tempCases);
            setDeaths(tempDeaths);
            setRecovered(tempRecovered);
          }
        });
    };

    fetchData();
  }, [country]);

  return (
    <Card>
      <CardContent>
      {
        error ? <h2>{error}</h2> :
        cases?.length > 0 &&
        <Line 
          data={{
            labels: labels,
            datasets: [{
              label: 'Cases',
              data: cases,
              backgroundColor: 'rgb(0, 0, 255)',
              borderColor: 'rgba(0, 0, 255, 0.2)',
            },
            {
              label: 'Deaths',
              data: deaths,
              backgroundColor: 'rgb(255, 0, 0)',
              borderColor: 'rgba(255, 0, 0, 0.2)',
            },
            {
              label: 'Recovered',
              data: recovered,
              backgroundColor: 'rgb(0, 107, 0)',
              borderColor: 'rgba(0, 255, 0, 0.2)',
            }]
          }}
        />
      }
      </CardContent>
    </Card>
  );
}

export default LineGraph;