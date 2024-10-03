'use client';

import DeckGL from '@deck.gl/react';
import {StaticMap} from 'react-map-gl';

import React, {useState, useEffect} from 'react';
import {MapView, MapViewState} from '@deck.gl/core';
import {BASEMAP} from '@deck.gl/carto';

export default function Scenario({scenarioProps, BaseLayer}){


    // scenario props contains
    // 1. variable number of layers and their corresponding styles
    // 2. Canvas to be draw to (singular)
    //
    const [viewState, setViewState] = useState({
        latitude: 39.0,
        longitude: -104.0,
        zoom: 4,
        bearing: 0,
        pitch: 0
      });


    const [staticlayers, updateLayers] = useState([]);
    //var canvasB = window.document.getElementById(scenarioProps.canvas);
    const [views, updateViews] = useState([
        new MapView({id: 'facetMap1_1', x:0,y:0, width:'50%', height:'50%'}),
        new MapView({id: 'facetMap1_2', x:'50%',y:0, width:'50%', height:'50%'}),
        new MapView({id: 'facetMap2_1', x:0,y:'50%', width:'50%', height:'50%'}),
        new MapView({id: 'facetMap2_2', x:'50%',y:'50%', width:'50%', height:'50%'})
      ]);
    const layers = []

    return (
        <DeckGL

            useDevicePixels={false}
            controller={true}
            initialViewState={viewState}
            layers={[...staticlayers,...layers]}
            views={views}
            viewState={viewState}
            onViewStateChange={evt => setViewState(evt.viewState)}

        >

        { views.map(({id}) => <MapView key={id} id={id}><StaticMap  mapStyle={BASEMAP.DARK_MATTER}/></MapView>) }
        </DeckGL>

    )

}


