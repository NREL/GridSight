import React, {useState, useEffect} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import PaletteIcon from '@mui/icons-material/Palette';
import BuildIcon from '@mui/icons-material/Build';
import {StyleController, FilterController} from './styleController'
import Box from '@mui/material/Box';


export default function LayerStyler({layerProp, onLayerPropChange}){
    const [value, setValue] = useState(0);

    const [showFilters, updateShowFilters] = useState(false);
    const [showStyles, updateShowStyles] = useState(false);

    const handleChange = (event, newValue) => {
        console.log("event triggered");
        console.log(layerProp);
        setValue(newValue);
    };


    function onFilterChange(newFilterProps){
        var newProps = layerProp;
        newProps.filters = newFilterProps;
        onLayerPropChange(newProps);
    }

    useEffect(()=>{
        console.log("value changed");
        if (value === 0){
            updateShowStyles(true);
            updateShowFilters(false);
        }
        else if (value === 1){
            updateShowStyles(false);
            updateShowFilters(true);
        }
    }, [value])

    return (
        <Box>
        <Tabs value={value} onChange={handleChange} aria-label="Styling Tabs">
            <Tab icon={<PaletteIcon/>} aria-label="Styling"/>
            <Tab icon={<FilterAltIcon/>} aria-label="Filters"/>
            <Tab icon={<BuildIcon/>} aria-label="Advanced" disabled/>
        </Tabs>
        <Box sx={{m:1}}>
            {showStyles &&
            <StyleController props={layerProp} onChange={onLayerPropChange}/>
            }
            {showFilters &&
            <FilterController props={layerProp.filters} onChange={(val)=>onFilterChange(val)}/>
            }
        </Box>
        </Box>
    )

}