'use client';

import React, {useState, useEffect} from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DatePicker } from '@mui/x-date-pickers';


export default function ClockController(){


    // Time State includes
    // start date
    // end date
    // frequency (hourly, 15 minute)
    // refresh rate

    return (
    <div id='clockController'>
        Time & Animation
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div>
            <DatePicker label = "Start Date"/>
            <DatePicker label = "End Date"/>
            </div>
        </LocalizationProvider>

    </div>
    )
}