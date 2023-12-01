import {GeoJsonLayer, ArcLayer} from '@deck.gl/layers';
import { SelectionLayer } from '@nebula.gl/layers';

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




export function create_vre_layer(GEO, DATA, selectedGenSet, radiusSlider, opacitySlider, frameRate, showLayer){
    // creates a scatter layer with
    // assumes curtailment will be

    const vre_layer = new GeoJsonLayer({
        id: 'vre',
        data: GEO,
        filled: true,
        visible: showLayer,
        lineWidthScale: 250*radiusSlider,
        lineWidthMinPixels: 0,
        lineWidthMaxPixels: 500,
        //lineWidthUnits: 'pixels',
        getLineWidth: f => transformations.setGeneratorLineWidth(getDataValues(DATA, 'generation', f.properties.GEN_ID), getDataValues(DATA, 'curt', f.properties.GEN_ID), selectedGenSet[f.properties.TECH]),
        getLineColor: transformations.GEN_MAP['Curtailment'],
        getFillColor: f => transformations.setGeneratorColor(f.properties.TECH),
        getPointRadius: f => transformations.setGeneratorRadius(getDataValues(DATA, 'generation', f.properties.GEN_ID), getDataValues(DATA, 'curt', f.properties.GEN_ID), selectedGenSet[f.properties.TECH]),
        pointRadiusScale: 250*radiusSlider,
        pointRadiusMinPixels: 0,
        pointRadiusMaxPixels: 500,
        //pointRadiusUnits:'pixels',
        pointType:'circle',
        opacity: opacitySlider,
        pickable: true,
        autoHighlight: true,
        onClick: info => logGenClick(info.object, DATA),
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

      return vre_layer

}


export function create_gen_layer(GEO, DATA, selectedGenSet, radiusSlider, opacitySlider, frameRate, showLayer){

    //like vre layer but no curtailment

    const gen_layer = new GeoJsonLayer({
        id: 'gen',
        data: GEO,
        filled: true,
        visible: showLayer,
        getFillColor: f => transformations.setGeneratorColor(f.properties.TECH),
        getLineColor: [255,255,255],
        getLineWidth:1,
        getPointRadius: f => transformations.setGeneratorRadius(getDataValues(DATA, 'generation', f.properties.GEN_ID),0.0, selectedGenSet[f.properties.TECH]),
        pointRadiusScale: 250*radiusSlider,
        pointRadiusMinPixels: 0,
        pointRadiusMaxPixels: 500,
        pointType:'circle',
        opacity: opacitySlider,
        pickable: true,
        autoHighlight: true,
        onClick: info => logGenClick(info.object, DATA),
        updateTriggers: {
            getPointRadius: [DATA, selectedGenSet, radiusSlider],
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


export function create_trx_layer(GEO, DATA,voltageFlags, lineWidthSlider, loadingFilter,  frameRate, showLayer, onClickFunc ){

    const trx_layer = new GeoJsonLayer({
        id: 'trx',
        data: GEO,
        visible: showLayer,
        filled: true,
        stroked: true,
        lineWidthScale: lineWidthSlider,
        lineWidthMinPixels: 0,
        lineWidthMaxPixels: 500,
        lineCapRounded: true,
        getLineWidth: f => transformations.setLineWidth( getDataValues(DATA, 'flow', f.properties.LINE_ID), voltageFlags[f.properties.TO_VN]),
        getLineColor: f =>  transformations.setLineColor(getDataValues(DATA, 'flow', f.properties.LINE_ID), f.properties.RATE, loadingFilter),

        updateTriggers: {
          getLineColor: [DATA, loadingFilter],
          getLineWidth: [DATA, voltageFlags, lineWidthSlider],
        },
        pickable: true,
        autoHighlight: true,
        //onClick: info => onClickFunc(info.object, DATA),
        onClick: info => onClickFunc(info),
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

    return trx_layer;

}



export function create_trx_arc_layer(GEO, DATA,voltageFlags, lineWidthSlider, opcacityTRX, loadingFilter,  frameRate, showFlow, showLayer, onClickFunc ){

  if (GEO){
    const trx_layer = new ArcLayer({
      id: 'trx',
      data: GEO['features'],
      visible: showLayer,
      filled: true,
      stroked: true,
      widthScale: lineWidthSlider,
      widthMinPixels: 0,
      widthMaxPixels: 500,
      widthUnits: 'meters',
      opacity: opcacityTRX,
      getSourcePosition: d=>d.geometry.coordinates[0],
      getTargetPosition: d=>d.geometry.coordinates[1],

      getSourceColor: d=> transformations.setFlowColor(getDataValues(DATA, 'flow', d.properties.LINE_ID), d.properties.RATE, loadingFilter, -1.0, showFlow),// sets color based on loading and direction
      getTargetColor: d=> transformations.setFlowColor(getDataValues(DATA, 'flow', d.properties.LINE_ID), d.properties.RATE, loadingFilter, 1.0, showFlow),

      getWidth: d => transformations.setLineWidth( getDataValues(DATA, 'flow', d.properties.LINE_ID), voltageFlags[d.properties.TO_VN]),
      getHeight: 0,

      updateTriggers: {
        getSourceColor: [DATA, loadingFilter, showFlow],
        getTargetColor: [DATA, loadingFilter, showFlow],
        getWidth: [DATA, voltageFlags, lineWidthSlider],
      },
      pickable: true,
      autoHighlight: true,
      onClick: info => logTrxClick(info.object, DATA),
      //onClick: info => onClickFunc(info),
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





export function create_zone_layer(GEO){
    const zone_layer = new GeoJsonLayer({
        id: 'zone',
        data: GEO,
        filled: false,
        //extruded: true,
        lineWidthScale: 1,
        lineWidthMinPixels: 3,
        lineWidthMaxPixels: 20,
        opacity: 20,
        stroked: true,
        getLineColor: [20,20,20],//f=> transformations.ZONE_COLORS[f.properties.transreg]
        //getFillColor: f=> transformations.ZONE_COLORS[f.properties.transreg],
        autoHighlight: true,
        pickable: true,
      })


    return zone_layer

}


export function create_state_layer(GEO){
    const states = new GeoJsonLayer({
        id: 'states',
        data: GEO,
        filled: true,
        //extruded: true,
        lineWidthScale: 1,
        lineWidthMinPixels: 1,
        lineWidthMaxPixels: 20,
        opacity: 0.8,
        getLineColor: [166, 166, 166],
        getFillColor: [90,90,90 ],
        //autoHighlight: true,
      })
    return states

}


const test_arc_data = [{

  id:'denver-salt',
  from: {
    name: 'Denver',
         coordinates: [-104.9903, 39.7392]
       },
  to: {
        name: 'Salt Lake',
         coordinates: [-111.8910, 40.7608 ]
      },
    }]



export function test_arc_layer() {

    const arc = new ArcLayer({

      id:'testarc',
      data: test_arc_data,
      getSourcePosition: d=>d.from.coordinates,
      getTargetPosition: d=>d.to.coordinates,
      getSourceColor: [200, 0, 0, 200],
      getTargetColor: [50, 50, 50, 20],
      getWidth: 10,
      getHeight: 0,
      lineCapRounded: true,

    })

    return arc
}