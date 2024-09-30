import {GeoJsonLayer, ArcLayer} from '@deck.gl/layers';
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
    }

  }
  return styling
}


export function create_vre_layer(GEO, DATA, selectedGenSet, styling, frameRate){
    // creates a scatter layer with
    // assumes curtailment will be

    const vre_layer = new GeoJsonLayer({
        id: 'vre',
        data: GEO,
        filled: true,
        visible: styling.visible,
        lineWidthScale: 250*styling.radiusScale,
        lineWidthMinPixels: 0,
        lineWidthMaxPixels: styling.maxRadius,
        //lineWidthUnits: 'pixels',
        getLineWidth: f => transformations.setGeneratorLineWidth(getDataValues(DATA, 'generation', f.properties.GEN_ID), getDataValues(DATA, 'curt', f.properties.GEN_ID), selectedGenSet[f.properties.TECH]),
        getLineColor: transformations.GEN_MAP['Curtailment'],
        getFillColor: f => transformations.setGeneratorColor(f.properties.TECH),
        getPointRadius: f => transformations.setGeneratorRadius(getDataValues(DATA, 'generation', f.properties.GEN_ID), getDataValues(DATA, 'curt', f.properties.GEN_ID), selectedGenSet[f.properties.TECH]),
        pointRadiusScale: 250*styling.radiusScale,
        pointRadiusMinPixels: styling.minRadius,
        pointRadiusMaxPixels: styling.maxRadius,
        //pointRadiusUnits:'pixels',
        pointType:'circle',
        opacity: styling.opacity,
        pickable: true,
        autoHighlight: true,
        onClick: info => logGenClick(info.object, DATA),
        updateTriggers: {
            getPointRadius: [DATA, selectedGenSet, styling.radiusScale],
            getLineWidth: [DATA, selectedGenSet, styling.radiusScale],

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


export function create_vre_layer2(GEO, DATA,  styling, frameRate){
  // creates a scatter layer with
  // assumes curtailment will be

  const vre_layer = new GeoJsonLayer({
      id: 'vre',
      data: GEO,
      filled: true,
      visible: styling.visible,
      lineWidthScale: 250*styling.pointStyles.Scale,
      lineWidthMinPixels: styling.lineStyles.MinPixels,
      lineWidthMaxPixels: styling.lineStyles.MaxPixels,
      lineWidthUnits: styling.lineStyles.Units,
      getLineWidth: f => transformations.setGeneratorLineWidth(getDataValues(DATA, 'generation', f.properties.GEN_ID), getDataValues(DATA, 'curt', f.properties.GEN_ID), true),
      getLineColor: transformations.GEN_MAP['Curtailment'],
      getFillColor: f => transformations.setGeneratorColor(f.properties.TECH),
      getPointRadius: f => transformations.setGeneratorRadius(getDataValues(DATA, 'generation', f.properties.GEN_ID), getDataValues(DATA, 'curt', f.properties.GEN_ID), true),
      pointRadiusScale: 250*styling.pointStyles.Scale,
      pointRadiusMinPixels: styling.pointStyles.MinPixels,
      pointRadiusMaxPixels: styling.pointStyles.MaxPixels,
      //pointRadiusUnits:'pixels',
      pointType:'circle',
      //opacity: styling.opacity,
      pickable: true,
      autoHighlight: true,
      //onClick: info => logGenClick(info.object, DATA),
      updateTriggers: {
          getPointRadius: [DATA, styling.pointStyles.Scale],
          getLineWidth: [DATA, styling.pointStyles.Scale],

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




export function create_gen_layer(GEO, DATA, selectedGenSet, styling, frameRate){

    //like vre layer but no curtailment

    const gen_layer = new GeoJsonLayer({
        id: 'gen',
        data: GEO,
        filled: true,
        visible: styling.visible,
        getFillColor: f => transformations.setGeneratorColor(f.properties.TECH),
        getLineColor: [255,255,255],
        getLineWidth:0,
        getPointRadius: f => transformations.setGeneratorRadius(getDataValues(DATA, 'generation', f.properties.GEN_ID),0.0, selectedGenSet[f.properties.TECH]),
        pointRadiusScale: 250*styling.radiusScale,
        pointRadiusMinPixels: styling.minRadius,
        pointRadiusMaxPixels: styling.maxRadius,
        pointType:'circle',
        opacity: styling.opacity,
        pickable: true,
        autoHighlight: true,
        onClick: info => logGenClick(info.object, DATA),
        updateTriggers: {
            getPointRadius: [DATA, selectedGenSet, styling.radiusScale],
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


export function create_gen_layer2(GEO, DATA, styling, frameRate){

  //like vre layer but no curtailment

  const gen_layer = new GeoJsonLayer({
      id: 'gen',
      data: GEO,
      filled: true,
      visible: styling.visible,
      getFillColor: f => transformations.setGeneratorColor(f.properties.TECH),
      getLineColor: [255,255,255],
      getLineWidth:0,
      getPointRadius: f => transformations.setGeneratorRadius(getDataValues(DATA, 'generation', f.properties.GEN_ID),0.0, true),
      pointRadiusScale: 250*styling.pointStyles.Scale,
      pointRadiusMinPixels: styling.pointStyles.MinPixels,
      pointRadiusMaxPixels: styling.pointStyles.MaxPixels,
      pointType:'circle',
      //opacity: styling.opacity,
      pickable: true,
      autoHighlight: true,
      //onClick: info => logGenClick(info.object, DATA),
      updateTriggers: {
          getPointRadius: [DATA, styling.pointStyles.Scale],
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



export function create_trx_arc_layer(GEO, DATA,voltageFlags,styling, frameRate, onClickFunc ){

  if (GEO){
    const trx_layer = new ArcLayer({
      id: 'trx',
      data: GEO['features'],
      visible: styling.visible,
      filled: true,
      stroked: true,
      widthScale: styling.widthScale,
      widthMinPixels: styling.minWidth,
      widthMaxPixels: styling.maxWidth,
      widthUnits: 'meters',
      opacity: styling.opacity,
      getSourcePosition: d=>d.geometry.coordinates[0],
      getTargetPosition: d=>d.geometry.coordinates[1],

      getSourceColor: d=> transformations.setFlowColor(getDataValues(DATA, 'flow', d.properties.LINE_ID), d.properties.RATE, styling.minLoading, -1.0, styling.showFlow),// sets color based on loading and direction
      getTargetColor: d=> transformations.setFlowColor(getDataValues(DATA, 'flow', d.properties.LINE_ID), d.properties.RATE,  styling.minLoading, 1.0, styling.showFlow),

      getWidth: d => transformations.setLineWidth( getDataValues(DATA, 'flow', d.properties.LINE_ID), voltageFlags[d.properties.TO_VN]),
      getHeight: 0,

      updateTriggers: {
        getSourceColor: [DATA, styling.minLoading, styling.showFlow],
        getTargetColor: [DATA, styling.minLoading, styling.showFlow],
        getWidth: [DATA, voltageFlags, styling.widthScale],
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




export function create_trx_arc_layer2(GEO, DATA, styling, frameRate ){

  if (GEO){
    const trx_layer = new ArcLayer({
      id: 'trx',
      data: GEO['features'],
      visible: styling.visible,
      filled: true,
      stroked: true,
      widthScale: styling.lineStyles.Scale,
      widthMinPixels: styling.lineStyles.MinPixels,
      widthMaxPixels: styling.lineStyles.MaxPixels,
      widthUnits: styling.lineStyles.Units,
      opacity: 1, //styling.opacity,
      getSourcePosition: d=>d.geometry.coordinates[0],
      getTargetPosition: d=>d.geometry.coordinates[1],

      getSourceColor: d=> transformations.setFlowColor(getDataValues(DATA, 'flow', d.properties.LINE_ID), d.properties.RATE, 0, -1.0, true),// sets color based on loading and direction
      getTargetColor: d=> transformations.setFlowColor(getDataValues(DATA, 'flow', d.properties.LINE_ID), d.properties.RATE,  0, 1.0, true),

      getWidth: d => transformations.setLineWidth( getDataValues(DATA, 'flow', d.properties.LINE_ID), true),
      getHeight: 0,

      updateTriggers: {
        getSourceColor: [DATA],//, styling.minLoading, styling.showFlow],
        getTargetColor: [DATA],//, styling.minLoading, styling.showFlow],
        getWidth: [DATA,  styling.lineStyles.Scale],//voltageFlags,
      },
      pickable: true,
      autoHighlight: true,
      //onClick: info => logTrxClick(info.object, DATA),
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