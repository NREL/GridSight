'use client';
import Tray from './Tray.js';
import React, {useState, useEffect} from 'react';
import Scenario from './Scenario.js'
import {BASEMAP} from '@deck.gl/carto';
import './app.css'

import DeckGL from '@deck.gl/react';
import {StaticMap} from 'react-map-gl';
import {MapView, MapViewState} from '@deck.gl/core';


import AnimatedArcLayer from './animated-arc-group-layer';
import type {AnimatedArcLayerProps} from './animated-arc-layer';



type Flight = {
    // Departure
    start_timestamp: number;
    longitude_1: number;
    latitude_1: number;
    alt1: number;

    // Arrival
    end_timestamp: number;
    longitude_2: number;
    latitude_2: number;
    alt2: number;

    //
    max_altitude: number;
  };


async function loadFlight(filename) {
    console.log("loading map")
    //const response = await fetch(`/grid/${filename}`)
    const response = await fetch(`/${filename}.json`)

    const data = await response.json();
    return data

  }


export function App() {

    // get metadata showing everything available to the user

    // Tray Component allows users to adjust aspects of the scenario/layers

    // ClockView component, movable div that just displays the time.

    // Scenarios - List of scenario components, should adjust layout as more
    const [BaseLayer, updateBaseLayer] = useState([{id: 1, name: "DARK_MATTER", layer: BASEMAP.DARK_MATTER, isCarto:true, clearColor:[0,0,0,0]}]);

    const [data, setData] = useState({})

    useEffect(()=>{
        loadFlight('flight_data_10').then( data=> {setData(data) })
    }, [])






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

    const showFlights = true;


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

    const timeWindow = 10;

    function getColor(){

    }
    const flightLayerProps: Partial<AnimatedArcLayerProps<Flight>> = {
        data,
        greatCircle: true,
        getSourcePosition: d => [d.longitude_1, d.latitude_1],
        getTargetPosition: d => [d.longitude_2, d.latitude_2],
        getSourceTimestamp: d => d.start_timestamp,
        getTargetTimestamp: d => d.end_timestamp,
        getSourceColor: d => d.color,//[200, 232, 255, 200],
        getTargetColor: d => d.color, // [200, 232, 255, 200],
        getHeight: d => d.max_altitude / 100000
      };

      const flightPathsLayer =
        showFlights &&
        new AnimatedArcLayer<Flight>({
          ...flightLayerProps,
          id: 'flight-paths',
          timeRange: [currentTime - 1, currentTime], // 10 minutes
          getWidth: 0.4,
          widthMinPixels: 1,
          widthMaxPixels: 4,
          widthUnits: 'common',
          //getSourceColor: [200, 232, 255, 200],
          //getTargetColor: [200, 232, 255, 200],
          parameters: {depthCompare: 'always'}
        });

      const flightMaskLayer = new AnimatedArcLayer<Flight>({
        ...flightLayerProps,
        id: 'flight-mask',
        timeRange: [currentTime - timeWindow, currentTime],
        operation: 'mask',
        getWidth: 5000,
        widthUnits: 'meters'
      });



    const numScenarios = 2

    //var Scenarios  =

    const [layerState, updateLayerState] = useState({})

    const [viewState, setViewState] = useState({
        latitude: 39.0,
        longitude: -104.0,
        zoom: 4,
        bearing: 0,
        pitch: 0
      });


    const [staticlayers, updateLayers] = useState([]);
    //var canvasB = window.document.getElementById(scenarioProps.canvas);
    //const [views, updateViews] = useState([
    //    new MapView({id: 'facetMap1_1', x:0,y:0, width:'100%', height:'100%'}),
    //    new MapView({id: 'facetMap1_2', x:'50%',y:0, width:'50%', height:'50%'}),
    //    new MapView({id: 'facetMap2_1', x:0,y:'50%', width:'50%', height:'50%'}),
    //    new MapView({id: 'facetMap2_2', x:'50%',y:'50%', width:'50%', height:'50%'})
    //  ]);
    const layers = [flightPathsLayer,flightMaskLayer]

    return (
        <DeckGL

            useDevicePixels={false}
            controller={true}
            initialViewState={viewState}
            layers={[...layers]}
            //views={views}
            viewState={viewState}
            onViewStateChange={evt => setViewState(evt.viewState)}

        >
        <StaticMap  mapStyle={BASEMAP.DARK_MATTER}/>


        <Tray userState={'test'} baseLayerProp={BaseLayer} onBaseLayerChange={(val)=>updateBaseLayer(val)}/>
        </DeckGL>

    )




}