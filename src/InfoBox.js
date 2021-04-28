import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import './InfoBox.css';

const InfoBox = ({ title, cases, total, type }) => {
  const cardClasses = 'infoBox infoBox__' + type;
  return (
    <Card className={cardClasses}>
      <CardContent>
        <Typography color='textSecondary' className='infoBox__title'>
          {title}
        </Typography>
        <h2>
          {Number(cases).toLocaleString()}
        </h2>
        <Typography color='textSecondary' className='infoBox__total'>
          {Number(total).toLocaleString()} total
        </Typography>
      </CardContent>
    </Card>
  )
}

export default InfoBox
