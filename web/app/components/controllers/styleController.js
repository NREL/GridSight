import React, {useState, useEffect, SyntheticEvent, ChangeEvent} from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { FormGroup } from '@mui/material';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';



export function CommonStyleController({type, props, onChange}){


    var name = 'Radius';
    if (type === 'Line'){
        name = 'Line';
    }

    // NEEDS more thought
    // Colors should be a seperate component?
    const handleSizeSource = (event) => {
        // if Single, number input
        // if Static, file or geojson and column/property
    }
    const handleSizeTypeChange = (event) =>{
        var newProps = props;
        newProps.SizeType = event.target.value;
        onChange(newProps);
    }

    const handleScaleChange = (event) => {
        var newProps = props;
        newProps.Scale = event.target.value;
        onChange(newProps);
    }

    const handleUnitsChange = (event) =>{
        var newProps = props;
        newProps.Units = event.target.value;
        onChange(newProps);
    }

    const handleMinPixelChange = (event) => {
        // default 0
        var newProps = props;
        newProps.MinPixels = event.target.value;
        onChange(newProps);
    }

    const handleMaxPixelChange = (event) => {
        var newProps = props;
        newProps.MaxPixels = event.target.value;
        onChange(newProps);
    }

    return (
        <Box >
            <Divider/>
            <h2>{type} Styling </h2>
                <FormControl>
                    <FormLabel id="radius-size-buttons"><h2>{name} Type</h2></FormLabel>
                    <RadioGroup
                    row
                    aria-labelledby='radial-size-buttons'
                    value={props.SizeType}
                    onChange={handleSizeTypeChange}
                    name='radial-size-buttons-group'
                    >
                    <FormControlLabel value="static" control={<Radio />} label='Static'/>
                    <FormControlLabel value="variable" control={<Radio />} label='Variable'/>
                    <FormControlLabel value="animated" control={<Radio />} label='Animated'/>
                    </RadioGroup>
                </FormControl>

                <h3>Scaling</h3>
                <Stack spacing={2} direction="row" sx={{alignItems: 'center', mb:1}}>
                <TextField
                label="Min Pixels"
                type='number'
                value={props.MinPixels}
                onChange={handleMinPixelChange}
                slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
                <TextField
                label="Max Pixels"
                type='number'
                value={props.MaxPixels}
                onChange={handleMaxPixelChange}
                slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
                <FormControl>
                    <FormLabel id="radial-unit-buttons">{type} Units</FormLabel>
                    <RadioGroup
                    row
                    aria-labelledby='radial-unit-buttons'
                    defaultValue="meters"
                    value={props.Units}
                    onChange={handleUnitsChange}
                    name='radial-unit-buttons-group'
                    >
                    <FormControlLabel value="meters" control={<Radio />} label='Meters'/>
                    <FormControlLabel value="pixels" control={<Radio />} label='Pixels'/>
                    <FormControlLabel value="common" control={<Radio />} label='Common'/>
                    </RadioGroup>
                </FormControl>

                </Stack>
                <Slider aria-label="Scale" value={props.Scale} onChange={handleScaleChange}/>
        </Box>
    )


}


export function StyleController({props, onChange}){


    function onPointStyleChange(newPointStyleProps){
        var newProps = props;
        newProps.pointStyles = newPointStyleProps;
        onChange(newProps)

    };


    function onLineStyleChange(newLineStyleProps){
        var newProps = props;
        newProps.lineStyles = newLineStyleProps;
        onChange(newProps);
    };
    // Need a way to save all these settings.

    // ERROR radio group is not "controlled" because of undefined inputs.
    return (
        <Box >
            <CommonStyleController type={'Point'} props={props.pointStyles} onChange={onPointStyleChange}/>
            <h3>Additional Point Styling</h3>
            <br/>
            <CommonStyleController type= {'Line'} props={props.lineStyles} onChange={onLineStyleChange}/>
            <h3>Additiona Line Styling</h3>
            <h3>Arc Styling</h3>

        </Box>
    )
}




export function FilterController({props, onChange}){


    return (
        <div>Filter controller content goes here</div>
    )
}