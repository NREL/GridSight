'use client';
import Tray from './Tray.js';
import React, {useState, useEffect} from 'react';
import {BASEMAP} from '@deck.gl/carto';
import './app.css'

import DeckGL from '@deck.gl/react';
import {StaticMap} from 'react-map-gl';


async function getScenarioMetadata(project, scenario){

    // returns a list of layer object metadata.

    // Data/Timeseries Routes
    // and color maps styling is passed to

    // layer routes and Data Objects are passed to layer generators.

    const response = await fetch(`/api/${p}/${s}/layers`)
    const data = await response.json();
    return data;
}


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

    // Tray Component allows users to adjust aspects of the scenario/layers

    // ClockView component, movable div that just displays the time.

    // Scenarios - List of scenario components, should adjust layout as more
    const [BaseLayer, updateBaseLayer] = useState(BASEMAP.DARK_MATTER);


    //Layer Objects

    useEffect(()=>{
        console.log("change in scenario state");
        console.log(scenarioState);
        //getScenarioMetadata(scenarioState.project, scenarioState.scenario).then(data=>updateLayerObjects(data));
    }, [scenarioState])


    var scenarioLayerProps = [

        {
            name:'Gen Layer',
            gridType: 'VRE or GEN or TRX, etc.',
            deckType: "GeoJsonLayer",
            geoPath: '/route/to/geo',

            timeseriesPaths: [
                {name:'series1', route:'/route/to/timeseries/1' },
                {name:'series2', route:'/route/to/timeseries/2' },
            ],
            // FEATURE REQUEST: add static files that you can style with
            //
            staticPaths:'/route/to/static/props',

            //Styling options common to all layer types.
            visible: true,
            pickable: false,

            pointStyles: {
                SizeType: 'single',//static or dynamic
                StaticSources:['static_file_1', 'static_file_2'],
                StaticSourceColumns: ['column1', 'column2'],
                DynamicSources:['timeseries_file_1', 'timeseries_file_2'],
                Size: 1, // if 'single' use as numeric, else, use as index in Sources above
                Scale: 1,
                Units: 'meters',//'common', or 'pixels'
                MinPixels: 0,
                MaxPixels: 100,
                pointAntialiasing: true,
                pointBillboard: false,

            },
            // common to all
            lineStyles: {
                SizeType: 'single',//static or dynamic
                StaticSources:['static_file_1', 'static_file_2'],
                StaticSourceColumns: ['column1', 'column2'],
                Size:1, //single, Static array, dynamic array,
                Scale:1,
                Units:'meters', //'common', or 'pixels'
                MinPixels:0,
                MaxPixels:1000,
                lineMiterLimit:4,
                lineCapRounded:false,
                lineJointRounded: false,
                lineBillboard: false,

            },
            arcStyles:{
                sourceColor:[[0,255,0]],
                targetColor:[[255,0,0]],
            },

            // Custom Stylings
            // TRX utlization threshold
            //
            additionalStyling:{
                property1: ['test']
            },
            // create a set of dynamic filters based on
            // properties in geojson.
            filters:{
                property1: ['test']
            },

        },

        {
            name:'TRX Layer',
            gridType: 'VRE or GEN or TRX, etc.',
            deckType: 'ArcLayer',
            geoPath: '/route/to/geo',

            timeseriesPaths: [
                {name:'series1', route:'/route/to/timeseries/1' },
                {name:'series2', route:'/route/to/timeseries/2' },
            ],
            // FEATURE REQUEST: add static files that you can style with
            //
            staticPaths:'/route/to/static/props',

            //Styling options common to all layer types.
            visible: true,
            pickable: false,
            pointStyles: {
                Source: 'single',//static or dynamic
                StaticSources:['static_file_1', 'static_file_2'],
                StaticSourceColumns: ['column1', 'column2'],
                DynamicSources:['timeseries_file_1', 'timeseries_file_2'],
                Size: 1, // if 'single' use as numeric, else, use as index in Sources above
                Scale: 1,
                Units: 'meters',//'common', or 'pixels'
                MinPixels: 0,
                MaxPixels: 100,
                pointAntialiasing: true,
                pointBillboard: false,

            },
            // common to all
            lineStyles: {
                Source: 'single',//static or dynamic
                StaticSources:['static_file_1', 'static_file_2'],
                StaticSourceColumns: ['column1', 'column2'],
                Size:1, //single, Static array, dynamic array,
                Scale:1,
                Units:'meters', //'common', or 'pixels'
                MinPixels:0,
                MaxPixels:1000,
                lineMiterLimit:4,
                lineCapRounded:false,
                lineJointRounded: false,
                lineBillboard: false,

            },
            arcStyles:{
                sourceColor:[[0,255,0]],
                targetColor:[[255,0,0]],
            },

            // Custom Stylings
            // TRX utlization threshold
            //
            additionalStyling:{
                property1: ['test']
            },
            // create a set of dynamic filters based on
            // properties in geojson.
            filters:{
                property1: ['test']
            },

        },


    ]


    const [layerProps, updateLayerProps] = useState(scenarioLayerProps);

    // Clock State (and index)
    var clockState = {
        startDate: "",
        endDate: "",
        playbackFrequency: 500, //ms between timesteps
        index: 0
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
            controller={false}
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
        scenarioProp={scenarioState}
        onScenarioChange={onSChange}
        layerProps={layerProps}
        onLayerPropChange={(val)=>updateLayerProps(val)}
          />
        </DeckGL>

    )




}