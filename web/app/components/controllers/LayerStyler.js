import React, {useState, useEffect, SyntheticEvent} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import PaletteIcon from '@mui/icons-material/Palette';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BuildIcon from '@mui/icons-material/Build';
import {StyleController, FilterController} from './styleController'

export default function LayerStyler({layerProp, onLayerPropChange}){
    const [value, setValue] = useState(0);

    const [showFilters, updateShowFilters] = useState(false);
    const [showStyles, updateShowStyles] = useState(false);

    const handleChange = (event, newValue) => {
        console.log("event triggered");
        console.log(layerProp);
        setValue(newValue);
    };

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
        <div>
        <Tabs value={value} onChange={handleChange} aria-label="Styling Tabs">
            <Tab icon={<PaletteIcon/>} aria-label="Styling"/>
            <Tab icon={<FilterAltIcon/>} aria-label="Filters" disabled/>
            <Tab icon={<BuildIcon/>} aria-label="Advanced" disabled/>
        </Tabs>
        <div>
            {showStyles &&
            <StyleController props={layerProp} onChange={(val)=>onLayerPropChange(val)}/>
            }
            {showFilters &&
            <FilterController/>
            }
        </div>
        </div>
    )

}