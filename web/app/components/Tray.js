'use client';
import {
    HiChevronRight, HiChevronLeft,
    HiSquare3Stack3D, HiClock, HiMiniListBullet,
    HiOutlineMap


} from "react-icons/hi2";
import React, {useState, useEffect} from 'react';
import BaseLayerController from "./BaseLayerControl";
import './tray.css'

export default function Tray({userState, baseLayerProp, onBaseLayerChange}){
    // user state has available options
    // selected options are passed back up the state tree

    const [showTray, updateShowTray] = useState(true);

    function toggleShowTray(){
        updateShowTray(showTray=>!showTray)
    }

    function onBaseSelect(val){

        onBaseLayerChange(val);
    }


    // based on selected project scenarios
    // Populate layers and Styling
    // Clock state can remain separate. (more of a global)


    // Tray button should be minimal when closed to make more room for the canvas.
    //
    return (

        <div id='Tray'>
            <div>
            <button className="trayButton" onClick={()=>toggleShowTray()}>

                {showTray &&

                <HiChevronRight/>
                }
                {!showTray &&
                <HiChevronLeft/>}
            </button>
            </div>

            {showTray &&

            <div id="TrayComponents">
                <div className="trayComponent">
                    <div className="trayButtonContainer">
                    <button className="trayButton">
                        <HiMiniListBullet size={30}/>
                    </button>
                    </div>
                    <div className="trayText">
                        Projects and Scenarios
                    </div>
                </div>
                <br/>
                <div className="trayComponent">

                    <div className="trayButtonContainer">
                    <button className="trayButton">
                        <HiOutlineMap size={30}/>
                    </button>
                    </div>
                    <div className="trayText">
                    Basemap
                    </div>

                </div>
                <div>
                    <BaseLayerController baseLayerProp={baseLayerProp} onLayerSelect={(val)=>onBaseSelect(val)}/>
                </div>
                <br/>
                <div className="trayComponent">

                    <div className="trayButtonContainer">
                    <button className="trayButton">
                        <HiSquare3Stack3D size={30}/>
                    </button>
                    </div>
                    <div className="trayText">
                    Layers and styling
                    </div>

                </div>
                <br/>
                <div className="trayComponent">

                    <div className="trayButtonContainer">
                    <button className="trayButton">
                        <HiClock size={30}/>
                    </button>
                    </div>
                    <div className="trayText">
                    Animation
                    </div>
                </div>
            </div>
            }
        </div>


    )

}