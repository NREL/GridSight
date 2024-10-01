import {GeoJsonLayer, ArcLayer} from '@deck.gl/layers';
import {DataFilterExtension} from '@deck.gl/extensions';
//import { SelectionLayer } from '@nebula.gl/layers';

import * as transformations from '../lib/transformations';


function getDataValues(DATA, type, id){

    if (id in DATA[type]){
      return DATA[type][id]
    }
    else{
      return 0.0
    }

  }


function logGenId(object){
  var msg = ` GEN_ID:${object.properties.GEN_ID}`
  alert(msg)
  console.log(msg)
}

function onClickProps(object){
  var msg = JSON.stringify(object.properties);
  alert(msg)
  console.log(msg)
}

function logGenClick(object, DATA){
    var msg = ` GEN_ID:${object.properties.GEN_ID} \n Generation:${DATA['generation'][object.properties.GEN_ID]} MW \n Curtailment:${DATA['curt'][object.properties.GEN_ID]} MW`
    alert(msg)
    console.log(msg)
  }

function logTrxClick(object, DATA){
    var msg = `LINE_ID:${object.properties.LINE_ID} \n RATE:${object.properties.RATE} \n Flow:${DATA['flow'][object.properties.LINE_ID]}`
    console.log(msg)
    //alert(msg);
    prompt("Copy to clipboard: Ctrl+C, Enter", msg)
  }



export function create_styling_object(name){


  var styling = {
    name: name,
    //Styling options common to all layer types.
    visible: true,
    pickable: false,
    autoHighlight: true,
    filled: true,
    opacity: 0.8,
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
      stroked:true,
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

    additional: {
      pickable: false,
      autoHighlight: true,
      opacity: 0.8,
      filled: true,
      stroked: true
    },

    filters:{
      enabled: false,
      transformSize: false,
      transformColor: false,
      type: 'Category',
      filterRange: [],
      filterSoftRange:[],
      filterCategories:[],
      allCategories:[],
    }


  }
  return styling
}




export function create_vre_layer2(GEO, DATA,  styling, frameRate){
  // creates a scatter layer with
  // assumes curtailment will be

  const vre_layer = new GeoJsonLayer({
      id: 'vre',
      data: GEO,
      filled: styling.additional.filled,
      visible: styling.visible,
      lineWidthScale: 250*styling.pointStyles.Scale,
      lineWidthMinPixels: styling.lineStyles.MinPixels,
      lineWidthMaxPixels: styling.lineStyles.MaxPixels,
      lineWidthUnits: styling.lineStyles.Units,
      getLineWidth: f => transformations.setGeneratorLineWidth(getDataValues(DATA, 'generation', f.properties.GEN_ID), getDataValues(DATA, 'curt', f.properties.GEN_ID)),
      getLineColor: transformations.GEN_MAP['Curtailment'],
      getFillColor: f => transformations.setGeneratorColor(f.properties.TECH),
      getPointRadius: f => transformations.setGeneratorRadius(getDataValues(DATA, 'generation', f.properties.GEN_ID), getDataValues(DATA, 'curt', f.properties.GEN_ID)),
      pointRadiusScale: 250*styling.pointStyles.Scale,
      pointRadiusMinPixels: styling.pointStyles.MinPixels,
      pointRadiusMaxPixels: styling.pointStyles.MaxPixels,
      pointRadiusUnits:styling.pointStyles.Units,
      pointType:'circle',
      opacity: styling.additional.opacity,
      pickable: styling.additional.pickable,
      autoHighlight: styling.additional.autoHighlight,
      //onClick: info => logGenClick(info.object, DATA),

      getFilterCategory: f=> f.properties.TECH,
      filterCategories: styling.filters.filterCategories,
      filterEnabled: styling.filters.enabled,
      extensions: [new DataFilterExtension({categorySize: 1})],


      updateTriggers: {
          getPointRadius: [DATA, styling.pointStyles.Scale],
          getLineWidth: [DATA, styling.pointStyles.Scale],
          getFilterCategory:[styling.filters],
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

    return vre_layer

}




export function create_gen_layer2(GEO, DATA, styling, frameRate){

  //like vre layer but no curtailment

  const gen_layer = new GeoJsonLayer({
      id: 'gen',
      data: GEO,
      filled: styling.additional.filled,
      visible: styling.visible,
      getFillColor: f => transformations.setGeneratorColor(f.properties.TECH),
      getLineColor: [255,255,255],
      getLineWidth:0,
      getPointRadius: f => transformations.setGeneratorRadius(getDataValues(DATA, 'generation', f.properties.GEN_ID),0.0),
      pointRadiusScale: 250*styling.pointStyles.Scale,
      pointRadiusMinPixels: styling.pointStyles.MinPixels,
      pointRadiusMaxPixels: styling.pointStyles.MaxPixels,
      pointType:'circle',
      opacity: styling.additional.opacity,
      pickable: styling.additional.pickable,
      autoHighlight: styling.additional.autoHighlight,
      onClick: info => onClickProps(info.object),

      getFilterCategory: f=> f.properties.TECH,
      filterCategories: styling.filters.filterCategories,
      filterEnabled: styling.filters.enabled,
      extensions: [new DataFilterExtension({categorySize: 1})],


      updateTriggers: {
          getPointRadius: [DATA, styling.pointStyles.Scale],
          getFilterCategory:[styling.filters],
          //getLineWidth: [DATA, selectedGenSet, radiusSlider],
      },
      transitions:{
          getPointRadius: {
              duration: frameRate,
          },
      },
      parameters: {
          depthTest: false,
      },

    });

  return gen_layer


}








export function create_trx_arc_layer2(GEO, DATA, styling, frameRate ){

  if (GEO){


    const trx_layer = new ArcLayer({
      id: 'trx',
      data: GEO['features'],
      visible: styling.visible,
      filled: styling.additional.filled,
      stroked: styling.additional.stroked,
      widthScale: styling.lineStyles.Scale,
      widthMinPixels: styling.lineStyles.MinPixels,
      widthMaxPixels: styling.lineStyles.MaxPixels,
      widthUnits: styling.lineStyles.Units,
      opacity: styling.additional.opacity,
      getSourcePosition: d=>d.geometry.coordinates[0],
      getTargetPosition: d=>d.geometry.coordinates[1],

      getSourceColor: d=> transformations.setFlowColor(getDataValues(DATA, 'flow', d.properties.LINE_ID), d.properties.RATE, 0, -1.0, true),// sets color based on loading and direction
      getTargetColor: d=> transformations.setFlowColor(getDataValues(DATA, 'flow', d.properties.LINE_ID), d.properties.RATE,  0, 1.0, true),

      getWidth: d => transformations.setLineWidth( getDataValues(DATA, 'flow', d.properties.LINE_ID), true),
      getHeight: 0,


      pickable: styling.additional.pickable,
      autoHighlight: styling.additional.autoHighlight,
      lineCapRounded: true,

      onClick: info => onClickProps(info.object),

      getFilterCategory: d => d.properties.TO_VN,
      filterCategories: styling.filters.filterCategories,
      filterEnabled: styling.filters.enabled,
      extensions: [new DataFilterExtension({categorySize: 1})],
      updateTriggers: {
        getSourceColor: [DATA],//, styling.minLoading, styling.showFlow],
        getTargetColor: [DATA],//, styling.minLoading, styling.showFlow],
        getWidth: [DATA,  styling.lineStyles.Scale],//voltageFlags,
        getFilterCategory: [styling.filters]
      },
      parameters: {
          depthTest: false,
      },
      transitions:{
          getSourceColor: {
              duration: frameRate,
          },
          getTargetColor:{
            duration: frameRate,
          },
          getWidth:{
            duration: frameRate
          }
      },
  });

  return trx_layer

}
}

