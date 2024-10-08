import React, {useState, useEffect} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Typography from '@mui/material/Typography';
import LayerStyler from './LayerStyler';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {BASEMAP} from '@deck.gl/carto';
import Divider from '@mui/material/Divider';

export default function LayerFactory({baseLayerProp, updateBaseSelect, deckLayersProps, updateDeckLayerProps}){

    const handleBaseChange = (event) => {
        console.log("base layer changed detected");
        console.log(event.target.value);
        //updateSelectedTile(event.target.value);
        updateBaseSelect(event.target.value);
    };


    function handleVisibilityClick(index){
        const newAllLayersProps = deckLayersProps.map((layer, i)=> {
            if (i === index){
                // toggle visibility bool
                layer.visible = !layer.visible
                return layer;
            }
            else{
                return layer;
            }
        })
        console.log("visibility toggled");
        console.log(index);
        updateDeckLayerProps(newAllLayersProps);

    }


    function handleSingleLayerChange(index, newLayerProps){
        const newAllLayersProps = deckLayersProps.map((layer, i)=>{
            if (i == index){
                return newLayerProps;
            }
            else{
                return layer;
            }
        })

        updateDeckLayerProps(newAllLayersProps);
    }

    // Passes the prop into each indivual layer object
    return (

        <Paper elevation={1} sx={{width: 600, maxHeight:800, overflowY: "auto", borderRadius: 2}}>
            <Typography variant='h4' align='center' bgcolor="primary.main" color="primary.contrastText" borderRadius={2}>
                Layer Styles
            </Typography>
            <Box sx={{ minWidth: 550, m: 1}}>
            <FormControl sx={{m:1}}>
            <InputLabel id="tile-layer-label">
                <Typography variant = 'h5'>
                Base Map
                </Typography>
            </InputLabel>
                <Select
                labelId="tile-layer-label"
                id="tile-layer-label"
                value={baseLayerProp}
                label="Base Layer"
                onChange={handleBaseChange}
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
            <Divider/>
            {
            deckLayersProps.map((layer, index)=>(
                <Box>
                <Stack spacing={1} direction="row" sx={{alignItems: 'center', ml:1, mb:1, width: '99%', maxHeight:'95%' }}>
                <Accordion sx={{width:'98%'}}>

                    <AccordionSummary
                    expandIcon={<ArrowDropDownIcon/>}>
                        <Typography variant='h5' align='center'>
                            {layer.name}
                        </Typography>

                    </AccordionSummary>
                    <AccordionDetails>
                        <Box>
                            <LayerStyler layerProp={layer} onLayerPropChange={(newProps)=>handleSingleLayerChange(index, newProps)}/>
                        </Box>

                    </AccordionDetails>
                </Accordion>
                <Button variant='text' size='medium' onClick={()=>{handleVisibilityClick(index)}} sx={{alignItems:'flex-start', justifyContent:'flex-start'}}>
                        {layer.visible &&
                        <VisibilityIcon/>
                        }
                        {!layer.visible &&
                        <VisibilityOffIcon/>}
                    </Button>
                </Stack>
            </Box>
            ))
        }
        </Paper>

    )


}