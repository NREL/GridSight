'use client';

import React, {useState, useEffect} from 'react';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';

export default function ClockController({props, onChange}){

    // TODO
    // Show, hide Movable clock
    // Sync between selected date range, and min/max index
    // Synce between min/max slider vals, and min/max date range
    // Value hover should be datetime.

    const theme = useTheme();

    
    function valuetext(value) {
        return `${value} Index`;
    }

    const handleSlideChange= (event, newValue)=>{
        onChange({...props, start_index: newValue[0], index:newValue[1], end_index:newValue[2]});
    };

    const incrementIndex = (event, val)=>{
        var newIndex = props.index+1
        onChange({...props, index: newIndex})
    }

    const decrementIndex = (event, val)=>{
        var newIndex = props.index-1
        onChange({...props, index: newIndex})
    }

    const handleFrequencyChange = (event, new_frequency)=>{
        onChange({...props, frequency: new_frequency})
    };


    const [index, updateIndex] = useState(props.index);

    const [selectedDateRange, updateDateRange] = useState({start: dayjs(props.startDate), end: dayjs(props.endDate)})

    useEffect(()=>{
        updateIndex(props.index)
    }, [props.index])

    const handleClockSwitch = (event)=>{
        onChange({...props, showClock: event.target.checked})
    };
    return (
    
    <Paper sx={{minWidth: 600, alignItems: 'center', margin:"1%", borderRadius:2}}>
        
        <Typography variant='h4' align='center' bgcolor="primary.main" color="primary.contrastText" borderRadius={2}>
                Animation
        </Typography>
        
        <Stack direction="column" spacing={2} alignContent='center' sx={{width:"100%",  margin: "2%"}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack direction="row" alignItems='center' justifyContent="center" spacing={2}>
            <DateTimePicker
            label="Start Date"
            disabled
            value={selectedDateRange.start}
            minDateTime ={dayjs(props.startDate)}
            maxDateTime={dayjs(props.endDate)}
            onChange={(newValue) => updateDateRange({...selectedDateRange, start:newValue})}
            />
            <DateTimePicker
            label="End Date"
            disabled
            value={selectedDateRange.end}
            minDateTime ={dayjs(props.startDate)}
            maxDateTime={dayjs(props.endDate)}
            onChange={(newValue) => updateDateRange({...selectedDateRange, end:newValue})}
            />
            </Stack>
            </LocalizationProvider>

            <Slider
            getAriaLabel={() => "Playback Window"}
            value={[props.start_index, index, props.end_index]}
            onChangeCommitted={handleSlideChange}

            valueLabelDisplay="auto"
            disableSwap
            getAriaValueText={valuetext}
            min={props.min_index} max={props.max_index} step={1}
            sx={{width:"95%", alignItems: 'center', justifyContent:'center', margin: "1%"}}
            />
            <Divider variant="middle" />
            <Box>
                <Typography variant='h6' align='center'>
                Playback
                </Typography>
            </Box>
            <Box sx={{minWidth: 500 , alignItems: 'center', justifyContent:'center'}}>
            <Stack direction="row" spacing={2} sx={{justifyContent: "center",alignItems: "center",}}>
                <IconButton onClick={()=>decrementIndex(-1)}>
                    <ArrowBackIcon/>
                </IconButton>
                {!props.animate &&

                <IconButton onClick={()=>onChange({...props, animate:true})}>
                    <PlayArrowIcon/>
                </IconButton>

                }
                {props.animate &&
                <IconButton onClick={()=>onChange({...props, animate: false})}>
                    <StopIcon/>
                </IconButton>
                }
                <IconButton onClick={()=>incrementIndex(1)}>
                    <ArrowForwardIcon/>
                </IconButton>
            </Stack>
            </Box>
            <Slider getAriaLabel={()=> "Playback Speed"}
                value={props.frequency}
                defaultValue={750}
                valueLabelDisplay='auto'
                onChange={handleFrequencyChange}
                min={100}
                max={2000}
                step={10}
            />
            <Divider variant="middle" />
            <Stack direction="row" spacing={1}>
                <Switch size='medium' checked={props.showClock} onChange={handleClockSwitch}/>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Typography variant='h6' align='center'>
                        Show Clock
                    </Typography>
                </Box>

            </Stack>
        </Stack>
    </Paper>
    )
}