'use client';
import DeckGL from '@deck.gl/react';
import { SelectionLayer } from '@nebula.gl/layers';
import React, {useState, useEffect} from 'react';
import Multiselect from 'multiselect-react-dropdown';

import * as transformations from '../lib/transformations';
import {create_gen_layer, create_state_layer, create_trx_layer, create_vre_layer, create_zone_layer, test_arc_layer, create_trx_arc_layer} from '../lib/layer_generators';

//import Colorbar from './colormap';
import { saveAs } from 'file-saver';
import Slider  from 'rc-slider';
import './slider.css';
import './controller.css'
import { Dispatch } from './dispatch.js';
import dynamic from 'next/dynamic';

const Timeseries = dynamic(()=> import('./timeseries.js'))

// Could move this into a different module

async function loadCommonGeo(filename) {
  console.log("loading map")
  //const response = await fetch(`/grid/${filename}`)
  const response = await fetch(`/grid/${filename}`)

  const data = await response.json();
  return data

}

async function loadScenarioGeo(project, scenario, filename) {
  console.log("loading map")

  const p = project[0].name
  const s = scenario[0].name
  //const response = await fetch(`/grid/${filename}`)
  const response = await fetch(`/api/geo/${p}/${s}/${filename}`)

  const data = await response.json();
  return data

}

async function fetchScenarioTimeStep(project, scenario, index){

  const p = project[0].name
  const s = scenario[0].name

  const response = await fetch(`/api/timeseries/${p}/${s}/${index}`)
  const data = await response.json();
  return data;
}


function makeLabels(list){
  var i = 1;
  var options = []
  console.log(list)
  for (const l in list){
    options.push({id: i, name:list[l]})
    i = i+1;
  }

  console.log("these are the options")
  console.log(options)
  return options
}


async function listProjects(){

  const response = await fetch(`/api/projects`, {cache: 'no-store'})
  const data = await response.json()

  return makeLabels(data)
}

async function listScenarios(project){
  console.log("Selected Project")
  const p = project[0].name
  console.log(project[0].name)
  const response = await fetch(`/api/projects/${p}`, {cache: 'no-store'})
  const data = await response.json()

  return makeLabels(data)
}



export function DeckApp() {

    // DeckGL Controller Flag
    const [outsideFilter, updateOutsideFilter] = useState(true);


    // Date Picker props
    const [DateTimeValue, onDateTimeChange] = useState(new Date());

    // buttons for inset plots
    const [showSeries, updateShowSeries] = useState(false);
    const [showDispatch, updateShowDispatch] = useState(false);
    function toggleSeriesPlot(){

      updateShowSeries(showSeries => !showSeries)
    }

    function toggleDispatchPlot(){
      updateShowDispatch(showDispatch => !showDispatch)
    }




    //timeindex
    const [index, onNext] = useState(4269);
    const[frameRate, updateFrameRate] = useState(500);


    //timeseries data
    const [DATA, setData] = useState({})
    const [currentTime, setCurrentTime] = useState();

    // Layer State Data
    const [ZONES, updateZones] = useState();
    const [TRX, updateTRX] = useState();
    const [VRE, updateVRE] = useState();
    const [GEN, updateGEN] = useState();
    const [STATES, updateStates] = useState();


    const [allProjects, updateAllProjects] = useState();
    const [project, updateProject] = useState('NTPS');
    const [allScenarios, updateAllScenarios] = useState();
    const [scenario, updateScenario] = useState('Scenario1');


    useEffect(() => {

      listProjects().then( data=> {updateAllProjects(data) })
      console.log("these are the projects")
      console.log(allProjects)
    }, [])

    useEffect(() => {
      listScenarios(project).then(data => {updateAllScenarios(data)})
    }, [project])


    // On initial load update
    useEffect(() => {
      loadCommonGeo('transreg_WKT.geojson').then(data=> {updateZones(data) ;});
      loadCommonGeo('states_provinces.geojson').then(data=> {updateStates(data) ;});
    }, [])

    useEffect(() => {
      console.log("updating scenario geo")
      loadScenarioGeo(project, scenario, 'transmission_map.geojson').then(data=> {updateTRX(data) ;});
      loadScenarioGeo(project, scenario,'vre_locs.geojson').then(data=> {updateVRE(data) ;});
      loadScenarioGeo(project, scenario,'nonvre_locs.geojson').then(data=> {updateGEN(data);})
    }, [scenario])


    //Transmission Filters and Styling
    const [showTRXFilters, updateTRXFilters] = useState(false);
    const [showTRXLayer, updateShowTRXLayer] = useState(true);
    const [loadingFilter, updateLoadingFilter] = useState(0.0);
    const [lineWidthSlider, updateLineWidthScale] = useState(5.0)
    const [opacityTRX, updateOpacityTRX] = useState(0.5)

    const [showFlow, updateShowFlow] = useState(false);
    function toggleFlow() {
      updateShowFlow(showFlow => !showFlow);
    }
    function toggleTRXLayer() {
      updateShowTRXLayer(showTRXLayer => !showTRXLayer )
    }



    function toggleTRXFilters(){
      updateTRXFilters(showTRXFilters => !showTRXFilters);
    }

    //Generation Filter
    const [showGenFilters, updateGenFilters] = useState(false);
    const [showGenLayer, updateShowGenLayer] = useState(true);
    const [radiusSlider, updateRadiusSlider] = useState(5.0)
    const [opacitySlider, updateOpacitySlider] = useState(0.5)


    function toggleGenFilters(){
      updateGenFilters(showGenFilters => !showGenFilters);
    }

    function toggleGenLayer(){
      updateShowGenLayer(showGenLayer=> !showGenLayer);
    }




    useEffect(() => {
      //setLoading(true)

      fetchScenarioTimeStep(project, scenario, index).then(data =>{

        setData(data)
        var currentTime = 0
        if ('DateTime' in data['generation']){
          var currentTime = data['generation']['DateTime'].split('.')[0]
        }
        else if ('Timestamp' in data['generation']){
          var currentTime = data['generation']['Timestamp'].split('.')[0]
        }

        setCurrentTime(currentTime)
      })
    }, [scenario, index]);

    // Animation
    const [animate, setAnimate] = useState(false);
    function playback_display() {
      if(animate){
          return "Stop"
      }
      else{
          return "Play"
      }
    };
    function toggleAnimation() {
      setAnimate(animate => !animate);
    }


    function playback_display(){
      if(animate){
          return "Stop"
      }
      else{
          return "Play"
      }
    }

    //Animate timestep
    useEffect(() => {
      const interval = setInterval(() => {
        if (animate) {
          onNext((index) => index + 1);
        }
      }, frameRate);
      return () => clearInterval(interval);
    }, [animate]);

    //Saving Image
    function saveImage(){
      var canvas = document.getElementById("deckgl-overlay");
      var currentdate = currentTime;
      var filename = `GridSight_${currentdate}.png`
      canvas.toBlob(function(blob) {
          saveAs(blob, filename);
      });
    }


    // Generator Filter stuff

    const [genFlags, updateGenFlags] = useState();
    //Update available options when new geojson
    useEffect(()=>{

      if (GEN){
        const newGenerationOptions = transformations.createFlags(GEN,'TECH');
        const newVREOptions = transformations.createFlags(VRE, 'TECH')
        var newGenOptions = Object.assign({}, newVREOptions, newGenerationOptions);
        console.log("these are the TECH options");
        updateGenFlags(newGenOptions);
        console.log(newGenOptions);

      }
    }, [GEN,VRE])

        //Dropdown options
    const availableGenOptions = transformations.createDropdownOptions(genFlags);
    const [selectedGenOptions, onGenHandle] = useState(transformations.createDropdownOptions(genFlags));

    const [selectedGenSet, updateSelectedGenSet] = useState();
    useEffect(()=>{
      updateSelectedGenSet(genFlags)
    }, [genFlags, scenario, project])


    useEffect(() => {

      var newFlags = {};

      for (var index in availableGenOptions){
        newFlags[availableGenOptions[index].name] = false
      }
      //
      for (var index in selectedGenOptions){
        var gen = selectedGenOptions[index].name;

        newFlags[gen] = true;
      }
      updateSelectedGenSet(newFlags);
      console.log(selectedGenSet)

    }, [selectedGenOptions])


    //END GEN FILTER STUFF


    //BEGIN Voltage Filter Stuff

    const [voltageFlags, updateVoltageFlags] = useState();
    //Update available options when new geojson
    useEffect(()=>{

      if (TRX){
        const newVoltageOptions = transformations.createFlags(TRX,'TO_VN');
        console.log("these are the voltage options");
        updateVoltageFlags(newVoltageOptions);
        console.log(newVoltageOptions);

      }
    }, [TRX])




    //Dropdown options
    const availableVoltageOptions = transformations.createDropdownOptions(voltageFlags);
    const [selectedVoltageOptions, onVoltageHandle] = useState(transformations.createDropdownOptions(voltageFlags));

    //update selected Flags when chosen in dropdown
    useEffect(() =>{

      var newFlags = {};

      for (var index in availableVoltageOptions){
        newFlags[availableVoltageOptions[index].name] = false
      }
      //
      for (var index in selectedVoltageOptions){
        var gen = selectedVoltageOptions[index].name;
        newFlags[gen] = true;
      }
      updateVoltageFlags(newFlags);
    }, [selectedVoltageOptions])


    //DeckGl Onclick Functionality
    const [selectedObjects, updateSelectedObjects] = useState();

    function onTRXClick(info){
      //console.log("this is the line id")
      //console.log(info.object.properties.LINE_ID)
      updateSelectedObjects(info.object.properties.LINE_ID)
      //update selected objects
    }


    //DeckGl stuff
    const INITIAL_VIEW_STATE = {
        latitude: 39.0,
        longitude: -104.0,
        zoom: 4,
        bearing: 0,
        pitch: 30
    }

    const states = create_state_layer(STATES);
    const zone_layer = create_zone_layer(ZONES);
    //const trx_layer = create_trx_layer(TRX, DATA, voltageFlags, lineWidthSlider, loadingFilter, frameRate )

    const trx_layer = create_trx_arc_layer(TRX, DATA, voltageFlags, lineWidthSlider, opacityTRX, loadingFilter, frameRate, showFlow, showTRXLayer, onTRXClick )
    const vre_layer = create_vre_layer(VRE, DATA, selectedGenSet, radiusSlider, opacitySlider, frameRate, showGenLayer)
    const gen_layer = create_gen_layer(GEN, DATA, selectedGenSet, radiusSlider, opacitySlider, frameRate, showGenLayer)





    const [selectionType, updateSelectionType] = useState(null);
    function toggleSelection(){
      if (selectionType == null){
        console.log("enabling selection")
        updateSelectionType('rectangle')
      }
      else{
        console.log("disabling selection")

        updateSelectionType(null)
      }
    }

    const select_layer = new SelectionLayer({
    id: 'selection',
    selectionType: selectionType, //'rectangle',
    onSelect: ({ pickingInfos }) => {
      //this.updateSelected(pickingInfos);
      console.log(pickingInfos)
    },
    layerIds: ['trx'],
    getTentativeFillColor: () => [255, 0, 255, 100],
    getTentativeLineColor: () => [0, 0, 255, 255],
    getTentativeLineDashArray: () => [0, 0],
    lineWidthMinPixels: 3,
    visible: true
    });


    const [showFilters, updateFilters] = useState(true);
    function toggleFilters() {
      updateFilters(showFilters => !showFilters);
    }

    // Layers
    const layers = [states,zone_layer, trx_layer,vre_layer, gen_layer, select_layer]

    return (

      <DeckGL
        controller={outsideFilter}
        initialViewState={INITIAL_VIEW_STATE}
        layers={layers }
        glOptions={{ preserveDrawingBuffer: true }}
        parameters={{
        clearColor: [0,0, 0.1, 1]
      }}>

      <div id='Dispatch' onMouseEnter={()=>updateOutsideFilter(false)} onMouseLeave={()=>updateOutsideFilter(true)}>
        <Dispatch index={index} project={project} scenario={scenario} visible={showDispatch}/>
      </div>


      <div id = "controller" onMouseEnter={()=>updateOutsideFilter(false)} onMouseLeave={()=>updateOutsideFilter(true) }>

      <button id='showFilters' class="button" onClick={() => toggleFilters()}>
        Show/Hide Filters
      </button>
      { showFilters &&
        <div id="filterOptions">

        <div>
          Projects
        <Multiselect
          id='ProjectSelect'
          class="MultiSelect"
          singleSelect={true}
          options={allProjects} // Options to display in the dropdown
          selectedValues={project} // Preselected value to persist in dropdown
          onSelect={(values) => updateProject(values)} // Function will trigger on select event
          onRemove={(values) => updateProject(values)} // Function will trigger on remove event
          displayValue="name" // Property name to display in the dropdown options
        />
        </div>
        <div>
          Scenarios
        <Multiselect
          id='ScenarioSelect'
          class="MultiSelect"
          singleSelect={true}
          options={allScenarios} // Options to display in the dropdown
          selectedValues={scenario} // Preselected value to persist in dropdown
          onSelect={(values) => updateScenario(values)} // Function will trigger on select event
          onRemove={(values) => updateScenario(values)} // Function will trigger on remove event
          displayValue="name" // Property name to display in the dropdown options
        />
        </div>



        <div id='Actions'>
          <button id="showDispatchPlot" class='button' onClick={()=> toggleDispatchPlot()}>
                    Show Dispatch
          </button>
          <button id='showTimeseriesPlot' class='button' onClick={()=>toggleSeriesPlot()}>Show Timeseries</button>

          <button id='selection' class="button" onClick={() => toggleSelection()}>
          Toggle Selection Layer
          </button>
          <button class='button' onClick={() => {saveImage()}}>
                Save Image
          </button>
          <a href="/api/auth/signout">
            Sign Out
          </a>
        </div>
        <button id="showGenFilters" class='button' onClick={()=> toggleGenFilters()}>
          Generation Filters
        </button>
        { showGenFilters &&
        <div class="FilterText">
          Generation Filter
        <Multiselect
          id='GenMultiSelect'
          class="MultiSelect"
          options={availableGenOptions} // Options to display in the dropdown
          selectedValues={selectedGenOptions} // Preselected value to persist in dropdown
          onSelect={(val) => onGenHandle(val)} // Function will trigger on select event
          onRemove={(val) => onGenHandle(val)} // Function will trigger on remove event
          displayValue="name" // Property name to display in the dropdown options
        />


        <div id='radius-scale' class='FilterText' >
          Scale = {radiusSlider}
          <Slider min={0} max={20} defaultValue={radiusSlider} step={0.1}
           onChange={(nextValues) => {updateRadiusSlider(nextValues)
          }} />
        </div>

        <div id='radius-scale' class='FilterText' >
          Opacity = {opacitySlider}
          <Slider min={0} max={1} defaultValue={opacitySlider} step={0.01}
           onChange={(nextValues) => {updateOpacitySlider(nextValues)
          }} />
        </div>

        <div id='GenCheckbox' className='LayerCheckbox'>
            Show Layer
            <input type='checkbox' checked={showGenLayer} onChange={()=>toggleGenLayer()}/>
        </div>

        </div>
        }


        <button id="showTRXFilters" class='button' onClick={()=> toggleTRXFilters()}>
          Transmission Filters
        </button>
        {showTRXFilters &&
        <div id = "TRXFilters">
        <div class="FilterText">
          Voltage Filter
        <Multiselect
          id='TRXMultiSelect'
          class="MultiSelect"
          options={availableVoltageOptions} // Options to display in the dropdown
          selectedValues={selectedVoltageOptions} // Preselected value to persist in dropdown
          onSelect={(val) => onVoltageHandle(val)} // Function will trigger on select event
          onRemove={(val) => onVoltageHandle(val)} // Function will trigger on remove event
          displayValue="name" // Property name to display in the dropdown options
        />
        </div>
        <div id='loading-filter' class='FilterText' >
          Loading {'>'}= {loadingFilter}
          <Slider min={0} max={1} defaultValue={loadingFilter} step={0.01}
           onChange={(nextValues) => {updateLoadingFilter(nextValues)
          }} />
        </div>

        <div id='linewidth-scale' class='FilterText' >
          Scale = {lineWidthSlider}
          <Slider min={0} max={20} defaultValue={lineWidthSlider} step={0.1}
           onChange={(nextValues) => {updateLineWidthScale(nextValues)
          }} />
        </div>

        <div id='radius-scale' class='FilterText' >
          Opacity = {opacityTRX}
          <Slider min={0} max={1} defaultValue={opacityTRX} step={0.01}
           onChange={(nextValues) => {updateOpacityTRX(nextValues)
          }} />
        </div>

        <div id='flowCheckbox' className='LayerCheckbox'>
          <div>
            Show Layer
            <input type='checkbox' checked={showTRXLayer} onChange={()=>toggleTRXLayer()}/>
          </div>
          <div>
            Show Flow
            <input type='checkbox' checked={showFlow} onChange={()=>toggleFlow()} />
          </div>
        </div>
        </div>
      }
        </div>

      }

      <div>
        <div id='AnimationOptions'>
          <div class='FilterText'>
            Timestamp
            <Slider min={0} max={8736} defaultValue={index} step={1}
            onAfterChange={(nextValues) => onNext(nextValues)} />
          </div>
          <div class='FilterText'>
            Frequency = {frameRate} ms
            <Slider min={100} max={2000} defaultValue={frameRate} step={10}
            onChange={(nextValues) => {updateFrameRate(nextValues)
            }}
          />
          </div>
          <div id='playback-controller'>
          <button class='playback-button' onClick={()=> onNext(index-1)}>
          &#8249; Back
          </button>
          <button class='playback-button' onClick={() => {toggleAnimation()}}>
            {playback_display()}
          </button>
          <button class='playback-button' onClick={()=> onNext(index+1)}>
          Next &#8250;
          </button>
          </div>

          <div id='CurrentDateTime'>{currentTime}</div>

        </div>
      </div>
      </div>

      <div id='TimeseriesContainer' onMouseEnter={()=>updateOutsideFilter(false)} onMouseLeave={()=>updateOutsideFilter(true)}>
        <Timeseries index={index} project={project} scenario={scenario} visible={showSeries} selected={selectedObjects}/>
      </div>

      </DeckGL>
    );
}
