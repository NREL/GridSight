'use client';
import {
    HiChevronRight, HiChevronLeft,
    HiSquare3Stack3D, HiClock, HiMiniListBullet,
    HiOutlineMap


} from "react-icons/hi2";
import React, {useState, useEffect} from 'react';
import BaseLayerController from "./BaseLayerControl";
import ClockController from "./controllers/clockController";
import ScenarioPicker from "./controllers/Scenarios";
import './tray.css'

export default function Tray({userState, baseLayerProp, onBaseLayerChange, scenarioState, onScenarioChange}){
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

    const onScenarioSelect = (val) => {
        onScenarioChange(val);
    };

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
            <div classname='trayButtonContainer'>
            <button className="trayButton" onClick={()=>toggleShowTray()}>

                {showTray &&

                <HiChevronRight size={buttonSize}/>
                }
                {!showTray &&
                <HiChevronLeft size={buttonSize}/>}
            </button>
            </div>
            {showTray &&

            <div className='trayButtonContainer'>
            <button className="trayButton" onClick={()=>updateShowScenarios(!showScenarios)}>
                <HiMiniListBullet size={buttonSize}/>
            </button>
            </div>
            }
            {showTray &&
            <div className='trayButtonContainer'>
            <button className="trayButton" onClick={()=>updateShowBasemaps(!showBasemaps)} >
                        <HiOutlineMap size={buttonSize}/>
            </button>
            </div>
            }
            {showTray &&
            <div className="trayButtonContainer">
                <button className="trayButton" onClick={()=>updateShowLayers(!showLayers)}>
                    <HiSquare3Stack3D size={buttonSize}/>
                </button>
            </div>
            }
            {showTray &&
            <div className="trayButtonContainer">
            <button className="trayButton" onClick={()=>updateShowTime(!showTime)}>
                        <HiClock size={buttonSize}/>
            </button>
            </div>
            }

            </div>



            {showTray &&

            <div id="TrayComponents">
                <div className="trayComponent">

                    {showScenarios &&
                        <div className="trayText">
                        Projects and Scenarios
                        <ScenarioPicker
                        scenarioProp={scenarioState}
                        onSChange={(val) => onScenarioSelect(val)}
                        />
                        </div>
                    }
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
                        Layers and styling
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