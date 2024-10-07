import React, {useState, useEffect} from 'react';
import ClockController from "./controllers/clockController";
import ScenarioPicker from "./controllers/Scenarios";
import LayerFactory from "./controllers/Layers";
import Box from '@mui/material/Box';

const trayWidth = 500;

export default function Tray({trayFlags, userState, baseLayerProp, onBaseLayerChange, scenarioProp, onScenarioChange, layerProps, onLayerPropChange, clockState, onClockChange}){


    function onBaseSelect(val){

        onBaseLayerChange(val);
    }

    function onScenarioSelect(val){
        onScenarioChange(val);
    }

    function onClockSlide(val){
        onClockChange(val)
    }

    return (

        <Box sw={{ height:'auto', maxHeight:'95%', boxShadow: 3 }}>

                <Box sw={{width: "100%", boxShadow: 3}}>
                    {trayFlags.scenarios &&

                        <ScenarioPicker
                        scenarioProp={scenarioProp}
                        onChange={(val) => onScenarioSelect(val)}
                        />
                    }
                </Box>

                <Box sw={{width: "100%" , boxShadow: 3}}>
                    {trayFlags.layers &&

                        <LayerFactory baseLayerProp={baseLayerProp} updateBaseSelect={(val)=>onBaseSelect(val)} deckLayersProps={layerProps} updateDeckLayerProps={onLayerPropChange}/>

                    }
                </Box>
                <Box sw={{width: "100%" , boxShadow: 3}}>
                    {trayFlags.animation &&

                            <ClockController props={clockState} onChange={onClockChange}/>
                    }
                </Box>
        </Box>


    )

}