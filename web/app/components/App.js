'use client';
import Tray from './Tray.js';
import React, {useState, useEffect} from 'react';
import {BASEMAP} from '@deck.gl/carto';
import './app.css'

import DeckGL from '@deck.gl/react';
import {StaticMap} from 'react-map-gl';

export function App() {

    // Message Bus for sync between tabs/windows.
    // get metadata showing everything available to the user
    // User State

    var user = {
        username: "Demo",
        AdminRoles:['roleObject'],
        shared:[], // list of shared resources

    }

    // Example Scenario State Object
    var tempScenarioState = {
        project: "DEMO",
        scenario: "DEMO"
    }
    const [scenarioState, updateScenarioState] = useState(tempScenarioState);

    const onSChange = (value) => {
        updateScenarioState(value);
    };

    // List of all layers available under the project/scenario
    // This doesn't necessarily turn on/off a layer
    var layerState2 = {
        layers: [] // list of layer objects (A class that returns the layer definition, available style options, and handles buffering)
    }

    //
    var clockState = {
        startDate: "",
        endDate: "",
        playbackFrequency: 500, //ms between timesteps
    }


    // Tray Component allows users to adjust aspects of the scenario/layers

    // ClockView component, movable div that just displays the time.

    // Scenarios - List of scenario components, should adjust layout as more
    const [BaseLayer, updateBaseLayer] = useState(BASEMAP.DARK_MATTER);

    var testLayerState = {
        layers: [
            {layerId: 'genlayer', type:'point', styling:{
                cmap:'category',

            }},
            {layerId: 'trxlayer', type:'line', styling:{
                cmap:'plasma',
                filled: true,
                visible: true,
                scale: 200,



            }}
        ]
    }


    const [currentTime, updateCurrentTime] = useState(150);

    //Animate timestep
    const [animate, showAnimate] = useState(true);
    const frameRate = 50;


    useEffect(() => {
        const interval = setInterval(() => {
        if (animate) {
                //console.log("updating time")
                updateCurrentTime((currentTime) => currentTime + 0.01);
              }
            }, frameRate);
            return () => clearInterval(interval);
          }, [animate]);

    const [viewState, setViewState] = useState({
        latitude: 39.0,
        longitude: -104.0,
        zoom: 4,
      });


    return (

        <DeckGL
            controller={true}
            useDevicePixels={true}
            initialViewState={viewState}
            //layers={[...staticlayers]}
            viewState={viewState}
            onViewStateChange={evt => setViewState(evt.viewState)}


        >
        <StaticMap id='mapbox' mapStyle={BaseLayer} reuseMaps={true}/>


        <Tray
        userState={'test'}
        baseLayerProp={BaseLayer}
        onBaseLayerChange={(val)=>updateBaseLayer(val)}
        scenarioState={scenarioState}
        onScenarioChange={onSChange}
          />
        </DeckGL>

    )




}