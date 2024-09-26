'use client';

import React, {useState, useEffect} from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DatePicker } from '@mui/x-date-pickers';
import Box from '@mui/material/Box';

export default function ClockController({props, onChange}){


    // Time State includes
    // start date
    // end date
    // frequency (hourly, 15 minute)
    // refresh rate

    return (
    <Box sx={{minWidth: 500, alignItems: 'center'}}>
        <h2>Time & Animation</h2>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div>
            <DatePicker label = "Start Date"/>
            <DatePicker label = "End Date"/>
            </div>
        </LocalizationProvider>

    </Box>
    )
}