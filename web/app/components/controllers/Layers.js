'use client';
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
export default function LayerFactory({AllLayersProps, updateAllLayerProps}){

    // Accordian

    function handleVisibilityClick(index){
        const newAllLayersProps = AllLayersProps.map((layer, i)=> {
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
        updateAllLayerProps(newAllLayersProps);

    }


    function handleSingleLayerChange(index, newLayerProps){
        const newAllLayersProps = AllLayersProps.map((layer, i)=>{
            if (i == index){
                return newLayerProps;
            }
            else{
                return layer;
            }
        })

        updateAllLayerProps(newAllLayersProps);
    }

    // Passes the prop into each indivual layer object
    return (
        <div>
            <h2>Layer Styles</h2>
            {
            AllLayersProps.map((layer, index)=>(
                <div>
                    <div>
                    <Button variant='text' size='medium' onClick={()=>{handleVisibilityClick(index)}}>
                        {layer.visible &&
                        <VisibilityIcon/>
                        }
                        {!layer.visible &&
                        <VisibilityOffIcon/>}
                    </Button>
                    </div>
                <Accordion>

                    <AccordionSummary
                    expandIcon={<ArrowDropDownIcon/>}>
                    {layer.name}
                    {index}
                    </AccordionSummary>
                    <AccordionDetails>
                        <LayerStyler layerProp={layer} onLayerPropChange={(newProps)=>handleSingleLayerChange(index, newProps)}/>
                    </AccordionDetails>
                </Accordion>

                </div>
            ))
        }
        </div>
    )


}