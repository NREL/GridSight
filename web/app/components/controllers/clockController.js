//'use client';

import React, {useState, useEffect, use} from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DatePicker } from '@mui/x-date-pickers';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ClockController({props, onChange}){


    // Time State includes
    // start date
    // end date
    // frequency (hourly, 15 minute)
    // refresh rate


    function valuetext(value) {
        return `${value} Index`;
    }


    //const [slideVals, updateSlideVals] = useState([props.start_index, props.index, props.end_index])
    const handleSlideChange= (event, newValue)=>{
        onChange({...props, start_index: newValue[0], index:newValue[1], end_index:newValue[2]});
        //updateIndex(newValue[1]);
    };

    const incrementIndex = (event, val)=>{
        var newIndex = props.index+1
        onChange({...props, index: newIndex})
    }

    const decrementIndex = (event, val)=>{
        var newIndex = props.index-1
        onChange({...props, index: newIndex})
    }


    //const [frequency, updateFrequency] = useState(750);
    const handleFrequencyChange = (event, new_frequency)=>{
        onChange({...props, frequency: new_frequency})
    };


    const [index, updateIndex] = useState(props.index);

    useEffect(()=>{
        updateIndex(props.index)
    }, [props.index])

    //useEffect(()=>{
    //    onChange({...props, index: index})
    //},[index])


    return (
    <Box sx={{minWidth: 600, alignItems: 'center', margin:"1%"}}>
        <Stack direction="column" spacing={2} sx={{width:"95%",  margin: "1%"}}>
            <h2>Time & Animation</h2>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack direction="row" spacing={2}>
            <DatePicker label = "Start Date"/>
            <DatePicker label = "End Date"/>
            </Stack>
            </LocalizationProvider>
            <Box>
            <Slider
            getAriaLabel={() => "Playback Window"}
            value={[props.start_index, index, props.end_index]}
            onChangeCommitted={handleSlideChange}

            valueLabelDisplay="auto"
            disableSwap
            getAriaValueText={valuetext}
            min={0} max={8760} step={1}
            sx={{width:"95%", alignItems: 'center', justifyContent:'center', margin: "1%"}}
            />
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
        </Stack>
    </Box>
    )
}