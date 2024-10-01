import React, {useState, useEffect} from 'react';
import BaseLayerController from "./controllers/BaseLayerControl";
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

        <Box sw={{ height:'auto', maxHeight:'85%', boxShadow: 3  }}>

                <Box sw={{width: "100%", boxShadow: 3,  color: '#000000'}}>
                    {trayFlags.scenarios &&

                        <ScenarioPicker
                        scenarioProp={scenarioProp}
                        onChange={(val) => onScenarioSelect(val)}
                        />
                    }
                </Box>

                <Box sw={{width: "100%" , boxShadow: 3, color: '#000000' }}>
                    {trayFlags.basemap &&
                    <BaseLayerController
                    baseLayerProp={baseLayerProp}
                    onLayerSelect={(val)=>onBaseSelect(val)}
                    />
                    }
                </Box>

                <Box sw={{width: "100%" , boxShadow: 3, color: '#000000'}}>
                    {trayFlags.layers &&

                        <LayerFactory AllLayersProps={layerProps} updateAllLayerProps={onLayerPropChange}/>

                    }
                </Box>
                <Box sw={{width: "100%" , boxShadow: 3, color: '#000000' }}>
                    {trayFlags.animation &&

                            <ClockController props={clockState} onChange={onClockChange}/>
                    }
                </Box>
        </Box>


    )

}