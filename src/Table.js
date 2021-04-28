import React from 'react';
import './Table.css';

const Table = ({countries}) => {
  return (
    <div className='table'>
      {
        countries.map(({country, cases}) => (
          <tr>
            <td>{country}</td>
            <td><b>{Number(cases).toLocaleString()}</b></td>
          </tr>
        ))
      }
    </div>
  )
}

export default Table;
