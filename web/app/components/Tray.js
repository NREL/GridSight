import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LayersIcon from '@mui/icons-material/Layers';
import MapIcon from '@mui/icons-material/Map';
import MenuIcon from '@mui/icons-material/Menu';

import React, {useState, useEffect} from 'react';
import BaseLayerController from "./controllers/BaseLayerControl";
import ClockController from "./controllers/clockController";
import ScenarioPicker from "./controllers/Scenarios";
import LayerFactory from "./controllers/Layers";
import './tray.css'

export default function Tray({userState, baseLayerProp, onBaseLayerChange, scenarioProp, onScenarioChange, layerProps, onLayerPropChange}){
    // user state has available options
    // selected options are passed back up the state tree

    const [showTray, updateShowTray] = useState(true);
    const [showScenarios, updateShowScenarios] = useState(false);
    const [showBasemaps, updateShowBasemaps] = useState(false);
    const [showLayers, updateShowLayers] = useState(false);
    const [showTime, updateShowTime] = useState(false);


    function toggleShowTray(){
        updateShowTray(showTray=>!showTray)
    }

    function onBaseSelect(val){

        onBaseLayerChange(val);
    }

    function onScenarioSelect(val){
        onScenarioChange(val);
    }

    var buttonSize = 50;

    useEffect(()=>{
        var flag = (showScenarios || showBasemaps || showLayers || showTime);
        if (showTray && !flag){
            updateShowScenarios(true);
        }
    }, [showTray])

    useEffect(()=>{
        var showButtons = (showScenarios || showBasemaps || showLayers || showTime);
        if (!showButtons){
            updateShowTray(!showTray);
        }
    },[showScenarios , showBasemaps , showLayers , showTime])
    // based on selected project scenarios
    // Populate layers and Styling
    // Clock state can remain separate. (more of a global)
    // Will need scenario metadata, start and end date for clock.


    // Tray button should be minimal when closed to make more room for the canvas.
    //
    return (

        <div id='Tray'>
            <div id = "trayButtons">
            <div className='trayButtonContainer'>
            <button className="trayButton" onClick={()=>toggleShowTray()}>

                {showTray &&
                <ChevronRightIcon size={buttonSize}/>

                }
                {!showTray &&
                <ChevronLeftIcon size={buttonSize}/>
                }
            </button>
            </div>
            {showTray &&

            <div className='trayButtonContainer'>
            <button className="trayButton" onClick={()=>updateShowScenarios(!showScenarios)}>
                <MenuIcon size={buttonSize}/>
            </button>
            </div>
            }
            {showTray &&
            <div className='trayButtonContainer'>
            <button className="trayButton" onClick={()=>updateShowBasemaps(!showBasemaps)} >
                <MapIcon size={buttonSize}/>
            </button>
            </div>
            }
            {showTray &&
            <div className="trayButtonContainer">
                <button className="trayButton" onClick={()=>updateShowLayers(!showLayers)}>
                    <LayersIcon size={buttonSize}/>
                </button>
            </div>
            }
            {showTray &&
            <div className="trayButtonContainer">
            <button className="trayButton" onClick={()=>updateShowTime(!showTime)}>
                <AccessTimeIcon size={buttonSize}/>
            </button>
            </div>
            }

            </div>



            {showTray &&

            <div id="TrayComponents">
                <div className="trayComponent">
                <div className="trayButtonContainer">
                    {showScenarios &&
                        <div className="trayText">
                        Projects and Scenarios
                        <ScenarioPicker
                        scenarioProp={scenarioProp}
                        onChange={(val) => onScenarioSelect(val)}
                        />
                        </div>
                    }
                </div>
                </div>
                <div className="trayComponent">

                    <div className="trayButtonContainer">

                    </div>
                    {showBasemaps &&
                    <div className="trayText">
                    Basemaps
                    <BaseLayerController
                    baseLayerProp={baseLayerProp}
                    onLayerSelect={(val)=>onBaseSelect(val)}
                    />
                    </div>
                    }
                </div>

                <div className="trayComponent">
                    {showLayers &&
                        <div className="trayText">
                            <LayerFactory AllLayersProps={layerProps} updateAllLayerProps={onLayerPropChange}/>
                        </div>
                    }
                </div>
                <div className="trayComponent">
                    {showTime &&
                        <div className="trayText">
                            <ClockController/>
                        </div>
                    }
                </div>
            </div>
            }
        </div>


    )

}