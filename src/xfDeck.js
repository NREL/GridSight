import DeckGL from '@deck.gl/react';
import {GeoJsonLayer} from '@deck.gl/layers';
import { SelectionLayer } from '@nebula.gl/layers';
import DateTimePicker from 'react-datetime-picker';import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
//import {PathStyleExtension} from '@deck.gl/extensions';
import React, {useState, useEffect} from 'react';
import Multiselect from 'multiselect-react-dropdown';
import * as transformations from './modules/transformations.js';
import { saveAs } from 'file-saver';
import Slider  from 'rc-slider';
import './slider.css';

// Could move this into a different module
function loadData(filename) {
  console.log("loading map")

  const data = api.sendSync("loadFile", filename)

  return data

}




function DeckApp() {

    // DeckGL Controller Flag
    const [outsideFilter, updateOutsideFilter] = useState(true);


    // Date Picker props
    const [DateTimeValue, onDateTimeChange] = useState(new Date());

    //timeindex
    const [index, onNext] = useState(4200);
    const[frameRate, updateFrameRate] = useState(500);



    //timeseries data
    const [DATA, setData] = useState({})
    const [currentTime, setCurrentTime] = useState();

    // Layer State Data
    const [ZONES, updateZones] = useState();
    const [TRX, updateTRX] = useState();
    const [GEN, updateGEN] = useState();

    // On initial load update
    useEffect(() => {
      updateZones(JSON.parse(loadData('transreg_WKT.geojson')));
      updateTRX(JSON.parse(loadData('AC_Lines_simple.geojson')));
      updateGEN(JSON.parse(loadData('generator_map.geojson')));
    }, [])


    //Transmission Filters and Styling
    const [showTRXFilters, updateTRXFilters] = useState(false);
    const [loadingFilter, updateLoadingFilter] = useState(0.0);
    const [lineWidthSlider, updateLineWidthScale] = useState(5.0)
    function toggleTRXFilters(){
      updateTRXFilters(showTRXFilters => !showTRXFilters);
    }

    //Generation Filter
    const [showGenFilters, updateGenFilters] = useState(false);
    const [radiusSlider, updateRadiusSlider] = useState(5.0)
    function toggleGenFilters(){
      updateGenFilters(showGenFilters => !showGenFilters);
    }




    useEffect(() => {
      async function updateData(timeindex) {
        let response = await api.invoke("getTimestep", timeindex)
        response = await response
        setData(response)
        setCurrentTime(response['generator'].DateTime)
      }
      updateData(index);
    }, [index])

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




    const [showFlow, setFlow] = useState(true);
    const [trxdashStart, updateDashStart] = useState(0);
    //Animate timestep
    useEffect(() => {
      const interval = setInterval(() => {
        if (showFlow) {
          const newdashStart = (Date.now() / 100) % 1000;
          updateDashStart(newdashStart);
          }
        }, frameRate);
        return () => clearInterval(interval);
    }, [showFlow]);


    function toggleFlow() {
      setFlow(showFlow => !showFlow);
    }

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
    const GenOptions = [{name:"Solar", id:1}, {name: "Wind", id:2}];
    const [selectedGenOptions, onGenHandle] = useState([{name:"Solar", id:1}, {name: "Wind", id:2}]);
    const [selectedGenSet, updateSelectedGenSet] = useState({"Wind": true, "Solar": true});

    useEffect(() => {

      var newFlags = {};

      for (var index in GenOptions){
        newFlags[GenOptions[index].name] = false
      }
      //
      for (var index in selectedGenOptions){
        var gen = selectedGenOptions[index].name;

        newFlags[gen] = true;
      }
      updateSelectedGenSet(newFlags);

    }, [selectedGenOptions])

    // Voltage Filter Stuff

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



    //DeckGl stuff
    const INITIAL_VIEW_STATE = {
        latitude: 39.0,
        longitude: -104.0,
        zoom: 4,
        bearing: 0,
        pitch: 30
    }


    const zone_layer = new GeoJsonLayer({
      id: 'zone',
      data: ZONES,
      filled: true,
      //extruded: true,
      lineWidthScale: 2,
      lineWidthMinPixels: 2,
      lineWidthMaxPixels: 20,
      opacity: 80,
      getLineColor: [166, 166, 166],
      getFillColor: [30,30,30 ],
      autoHighlight: true,
    })


    const trx_layer = new GeoJsonLayer({
        id: 'trx',
        data: TRX,
        filled: true,
        stroked: true,
        lineWidthScale: lineWidthSlider,
        lineWidthMinPixels: 1,
        lineWidthMaxPixels: 1000,
        lineCapRounded: true,
        getLineWidth: f => transformations.setLineWidth(DATA['line'][f.properties.LINE_ID], voltageFlags[f.properties.TO_VN]),
        getLineColor: f =>  transformations.setLineColor(DATA['line'][f.properties.LINE_ID], f.properties.RATE, loadingFilter),
        updateTriggers: {
          getLineColor: [DATA, loadingFilter],
          getLineWidth: [DATA, voltageFlags, lineWidthSlider],
        },
        pickable: true,
        autoHighlight: true,
        //onClick: this.onClick,
        //extensions: [new PathStyleExtension({dash: true})],
        //getDashArray: [0, 0],
        parameters: {
            depthTest: false,
        },
        transitions:{
            getLineColor: {
                duration: frameRate,
            },
            getLineWidth:{
              duration: frameRate
            }
        },
    });

    const gen_layer = new GeoJsonLayer({
      id: 'gen',
      data: GEN,
      filled: true,
      lineWidthScale: 500*radiusSlider,
      lineWidthMinPixels: 0,
      lineWidthMaxPixels: 100000,
      //visible: f => transformations.setGeneratorColor(f.properties.RENEWABLE, selectedGen[f.properties.RENEWABLE]),
      getLineWidth: f => transformations.setGeneratorLineWidth(DATA['generator'][f.properties.GEN_ID], DATA['curtailment'][f.properties.GEN_ID], selectedGenSet[f.properties.RENEWABLE]),
      getLineColor: [225,225,225,80],
      getFillColor: f => transformations.setGeneratorColor(f.properties.RENEWABLE),
      getPointRadius: f => transformations.setGeneratorRadius(DATA['generator'][f.properties.GEN_ID], DATA['curtailment'][f.properties.GEN_ID], selectedGenSet[f.properties.RENEWABLE]),
      pointRadiusScale: 500*radiusSlider,
      pointRadiusMinPixels: 0,
      pointRadiusMaxPixels: 100000,
      pointType:'circle',
      //pickable: true,
      autoHighlight: true,
      //onClick: this.onClick,
      updateTriggers: {
          getPointRadius: [DATA, selectedGenSet, radiusSlider],
          getLineWidth: [DATA, selectedGenSet, radiusSlider],

      },
      transitions:{
          getPointRadius: {
              duration: frameRate,
          },
          getLineWidth:{
              duration: frameRate,
          }
      },
      parameters: {
          depthTest: false,
        },
    });


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
    const layers = [zone_layer, trx_layer, gen_layer, select_layer]

    return (
      <DeckGL
        controller={outsideFilter}
        initialViewState={INITIAL_VIEW_STATE}
        layers={layers }
        glOptions={{ preserveDrawingBuffer: true }}
        parameters={{
        clearColor: [173, 216, 230, 50]
      }}>

      <div id = "controller" onMouseEnter={()=>updateOutsideFilter(false)} onMouseLeave={()=>updateOutsideFilter(true) }>

      <button id='showFilters' class="button" onClick={() => toggleFilters()}>
        Show/Hide Filters
      </button>
      { showFilters &&
        <div id="filterOptions">
        <div id='Actions'>
          <button id='selection' class="button" onClick={() => toggleSelection()}>
          Toggle Selection Layer
          </button>
          <button class='button' onClick={() => {saveImage()}}>
                Save Image
          </button>
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
          options={GenOptions} // Options to display in the dropdown
          selectedValues={selectedGenOptions} // Preselected value to persist in dropdown
          onSelect={(val) => onGenHandle(val)} // Function will trigger on select event
          onRemove={(val) => onGenHandle(val)} // Function will trigger on remove event
          displayValue="name" // Property name to display in the dropdown options
        />


        <div id='radius-scale' class='FilterText' >
          Scale = {radiusSlider}
          <Slider min={0} max={10} defaultValue={radiusSlider} step={0.1}
           onChange={(nextValues) => {updateRadiusSlider(nextValues)
          }} />
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
          <Slider min={1} max={10} defaultValue={lineWidthSlider} step={0.1}
           onChange={(nextValues) => {updateLineWidthScale(nextValues)
          }} />
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

      </DeckGL>
    );


}


export default DeckApp;