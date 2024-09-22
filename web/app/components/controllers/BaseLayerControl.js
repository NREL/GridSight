'use client';
import React, {useState} from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {BASEMAP} from '@deck.gl/carto';


export default function BaseLayerController ({baseLayerProp, onLayerSelect}){


    //const [selectedTile, updateSelectedTile] = useState(BASEMAP.DARK_MATTER_NOLABELS);

    const handleChange = (event) => {
        console.log("base layer changed detected");
        console.log(event.target.value);
        //updateSelectedTile(event.target.value);
        onLayerSelect(event.target.value);
    };

    return (
        <div id="BaseLayerController">


        <Box sx={{ minWidth: 200 }}>
        <FormControl fullWidth>
          <InputLabel id="tile-layer-label">Base Map</InputLabel>
          <Select
            labelId="tile-layer-label"
            id="tile-layer-label"
            value={baseLayerProp}
            label="Base Layer"
            onChange={handleChange}
          >
            <MenuItem value={BASEMAP.DARK_MATTER}>DARK_MATTER</MenuItem>
            <MenuItem value={BASEMAP.DARK_MATTER_NOLABELS}>DARK_MATTER_NOLABELS</MenuItem>
            <MenuItem value={BASEMAP.POSITRON}>POSITRON</MenuItem>
            <MenuItem value={BASEMAP.POSITRON_NOLABELS}>POSITRON_NOLABELS</MenuItem>
            <MenuItem value={BASEMAP.VOYAGER}>VOYAGER</MenuItem>
            <MenuItem value={BASEMAP.VOYAGER_NOLABELS}>VOYAGER_NOLABELS</MenuItem>

          </Select>
        </FormControl>
        </Box>

        </div>



    )


}