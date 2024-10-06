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
import { Checkbox, FormGroup, ListItemText, MenuItem, Select, Typography } from '@mui/material';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';


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
        newProps.Scale = parseInt(event.target.value);
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
        newProps.MinPixels = parseInt(event.target.value);
        onChange(newProps);
    }

    const handleMaxPixelChange = (event) => {
        var newProps = props;
        newProps.MaxPixels = parseInt(event.target.value);
        onChange(newProps);
    }

    return (
        <Box >
            <Stack direction="column" spacing={1}>
            <Typography variant='h5' align='center'>
                {type} Sizing
            </Typography>
                {false &&
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
                }

                <Stack direction="row" spacing={2}>
                    <Box>
                        <Typography type='h6' align='center'>
                            Scale Factor
                        </Typography>
                    </Box>
                    <Slider aria-label="Scale" value={props.Scale} onChange={handleScaleChange}/>
                </Stack>
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

                </Stack>
        </Box>
    )


}

export function AdditionalStyleController({props, onChange}){

    const handleFlagChange = (event)=>{
        onChange({...props, [event.target.name]: event.target.checked})
    }

    const handleSlideChange = (event)=>{
        onChange({...props, opacity: event.target.value})
    }

    return (
        <Box>
            <Typography variant='h5' align='center'>
                Additional Styling
            </Typography>
            <Stack direction="row">
                <FormControl component="fieldset" variant='standard'>
                    <FormLabel component="legend">Flags</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                        control={<Switch checked={props.pickable} onChange={handleFlagChange} name="pickable"/>}
                        label="Pickable"
                        />
                        <FormControlLabel
                        control={<Switch checked={props.autoHighlight} onChange={handleFlagChange} name="autoHighlight"/>}
                        label= "Auto-Highlight"
                        />
                        <FormControlLabel
                        control={<Switch checked={props.filled} onChange={handleFlagChange} name='filled'/>}
                        label = "Filled"
                        />
                        <FormControlLabel
                        control={<Switch checked={props.stroked} onChange={handleFlagChange} name='stroked'/>}
                        label= "Stroked"
                        />

                    </FormGroup>
                </FormControl>
                <Box>
                    <Stack direction='column' spacing={2} height={'100%'}>
                    <Typography align='center'>
                        Opacity
                    </Typography>
                    <Slider aria-label='Opacity' orientation='vertical' value={props.opacity} step={0.01} min={0} max={1} onChange={handleSlideChange}/>
                    </Stack>
                </Box>


            </Stack>
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

    function onAdditionalChange(newAdditionalProps){
        var newProps = props;
        newProps.additional = newAdditionalProps;
        onChange(newProps);
    }

    // Need a way to save all these settings.

    // ERROR radio group is not "controlled" because of undefined inputs.
    return (
        <Box >
            <Stack direction="column" spacing={1}>
            <Divider/>
            <CommonStyleController type={'Point'} props={props.pointStyles} onChange={onPointStyleChange}/>
            <Divider/>
            <CommonStyleController type= {'Line'} props={props.lineStyles} onChange={onLineStyleChange}/>
            <Divider/>
            <AdditionalStyleController props={props.additional} onChange={onAdditionalChange}/>
            </Stack>
        </Box>
    )
}





const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


export function FilterController({props, onChange}){

    const handleFlagChange = (event)=>{
        onChange({...props, [event.target.name]: event.target.checked})
    }

    const handleFilterChange = (event)=>{

        const {
            target: {value},
        } = event;
        onChange({...props, filterCategories: value})
        //var selectedCategories = props.filterCategories;
        //selectedCategories.push(event.target.value[0])

        //onChange({...props, filterCategories: selectedCategories})

    }

    return (
            <Box sx={{m:1}}>
            <Divider sx={{m:2}}/>
            <Stack direction="row" spacing={2}>
                <FormControl component="fieldset" variant='standard'>
                    <FormLabel component="legend">Flags</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                        control={<Switch checked={props.enabled} onChange={handleFlagChange} name="enabled"/>}
                        label="Enable Filter"
                        />
                        <FormControlLabel
                        control={<Switch checked={props.transformSize} onChange={handleFlagChange} name="transformSize"/>}
                        label= "Transform Size"
                        />
                        <FormControlLabel
                        control={<Switch checked={props.transformColor} onChange={handleFlagChange} name='transformColor'/>}
                        label = "Transform Color"
                        />


                    </FormGroup>
                </FormControl>
                <FormControl sx={{m:1, width: 400}}>
                    <InputLabel>Filtered</InputLabel>
                    <Select
                        multiple
                        value={props.filterCategories}
                        onChange={handleFilterChange}
                        input={<OutlinedInput label="Selected" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                    >
                    {props.allCategories.map((category)=> (
                        <MenuItem key={category} value={category}>
                            <Checkbox checked={props.filterCategories.includes(category)}/>
                            <ListItemText primary={category}/>
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

            </Stack>
            <Divider/>
            <Box>
                {JSON.stringify(props)}
            </Box>
        </Box>
    )
}