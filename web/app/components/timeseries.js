'use client';
import React, {useState, useEffect} from 'react';
import { Line } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    TimeScale,
    LineController,
    ScatterController,
    PointElement,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  BarElement,
  LineController,
  ScatterController,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
)



async function getTimeSeries(project, scenario, filename) {
  try {
    const p = project[0].name
    const s = scenario[0].name

    const response = await fetch(`/api/timeseries/${p}/${s}/files/${filename}`, {cache: "no-store"})

    const data = await response.json();
    return JSON.parse(data)
  }
  catch (e) {
    console.log(e)
  }

}

async function getSelectedTimeSeries(project, scenario, selected){

  try {
    const p = project[0].name
    const s = scenario[0].name

    const formatted_selected = encodeURIComponent(selected).replaceAll('%_', '%25_').replaceAll('~','%7E')//.replaceAll('_','%5F') //.replace('%', '%25')
    console.log(selected)
    console.log(formatted_selected)
    const response = await fetch(`/api/timeseries/${p}/${s}/lines/${formatted_selected}`)

    const data = await response.json();
    console.log(data)
    return data
  }
  catch (e) {
    console.log(e)
  }


}

var color_dict = {}


function getOptions(xtype) {
  var xTitle = 'Date'
  if (xtype =='linear'){
    xTitle = 'Rank'
  }
  const options = {
    animation: true,
    //type: 'bar',
    spanGaps: true, // enable for all datasets
    responsive: true,
    elements: {
      point: {
          radius: 0 // default to disabled in all datasets
      }
    },
    scales: {
      x: {
        type: xtype,

        time: {
          // Luxon format string
          tooltipFormat: 'dd T'
        },
        title: {
          display: true,
          text: xTitle
        }
      },
      y: {
        type:'linear',
      }
    },
    animations:{
      tension: {
        duration: 500,
        easing:'linear',
      },
    },
    transitions:{
      zoom: {
        animation: {
          duration: 50,
        }
      },
      pan: {
        animation: {
          duration: 50,
        }
      }
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
          modifierKey:'ctrl',
          threshold:0,
          sensitivity: 0,
          speed:1
        },
        zoom: {
          enabled: true,
          drag: false,
          threshold:0,
          sensitivity: 0,
          speed:1,
          wheel: {
            enabled: true,
          },
          drag: {
            enabled: true,
            modifierKey:'ctrl',
          },
          mode: 'x',
        }
      }
    }

  }
  return options
}

function getRandom255(){
  return Math.floor(Math.random()*255)
}

function getRandomColor(){

  return `rgba(${getRandom255()}, ${getRandom255()}, ${getRandom255()}, 0.7)`
}

function compareNumbers (a,b){
  return a-b;
}


async function createTraces(timeseries_data, showLDC, showSelected) {

    const col_data = timeseries_data.columns

    var temp_datasets = []
    var labels = []
    var timelabels = []
    for (var i = 0; i < col_data.length; i++) {

      var column = col_data[i]

      if (column.name.toLowerCase() == 'datetime'){
        timelabels = column.values
      }
      else {

        var temp_data = []
        if (showLDC){
          temp_data = column.values.toSorted(compareNumbers).reverse()
        }
        else {
          temp_data = column.values
        }

        //assign color
        if (column.name in color_dict){
          var color = color_dict[column.name]
        }
        else{
          var color = getRandomColor()
          color_dict[column.name] = color
        }

        var trace = {
            type: 'line',
            animation: false,
            label: column.name,
            data: temp_data,
            borderColor: color,
            backgroundColor: color
        }
        temp_datasets.push(trace)

      }

    }

    if (showLDC | showSelected) {
      labels = [...Array(timelabels.length).keys()]
    }
    else {
      labels = timelabels
    }


    return {labels, datasets: temp_datasets}
}


function createVerticalLine(index, labels){

  var temp_data = [];

  for(var i =0; i< labels.length; i++){
    if (i == index){
      temp_data.push(20000)
    }
    else{
      temp_data.push(0)
    }
  }

  var trace = {
    type: 'line',
    label: 'current',
    data: temp_data,
    animation: true,
    borderColor: 'rgba(200,10,10, 0.5)',
    backgroundColor: 'rgba(200,10,10, 0.5)',
    order: 1
    //barThickness: 200,
    //maxBarThickness: 200,
  }
  return trace
}



export default function Timeseries({index, project, scenario, visible, selected}) {

    // for static pre-defined power flow
    const [timeseries_data, updateData] = useState();

    const [chartTraces, updateChart] = useState({labels:[], datasets:[]});

    const [selectedData, updateSelectedData] = useState();
    const [selectedTraces, updateSelectTraces] = useState({labels:[], datasets:[]});
    const [showSelected, updateShowSelected] = useState(false);

    const [ready, UpdateLoading] = useState(false);

    const [showLDC, updateLDC] = useState(false);
    function toggleLDC() {
      console.log("toggling LDC")
      updateLDC(showLDC => !showLDC);
    }


    useEffect(()=>{
      console.log("plot these new selections")
      getSelectedTimeSeries(project, scenario, selected).then( data=> {updateSelectedData(data);})
    }, [selected])

    useEffect(() => {

      getTimeSeries(project, scenario, 'power_flow_actual_superzone.pq.gz').then(data => {updateData(data);})

    }, [scenario])




    const[options, updateOptions] = useState({});
    useEffect(()=> {
      var new_options = getOptions()
      if (showLDC | showSelected){
        new_options = getOptions('linear')
      }
      else {
        new_options = getOptions('time')
      }

      updateOptions(new_options);
    }, [timeseries_data, showLDC, selectedData] )


    // create traces
    useEffect(()=> {
      console.log('new timeseries data')
      if(timeseries_data != undefined){
        createTraces(timeseries_data, showLDC, showSelected).then(new_traces => {updateChart(new_traces)})
        UpdateLoading(true);

      }
    }, [timeseries_data, showLDC])

        // create selection traces
    useEffect(()=> {

            console.log("these are the selected data")
            console.log(selectedData)
            createTraces(selectedData, showLDC, showSelected).then(new_traces => {updateSelectTraces(new_traces)})

            console.log("these are the selected traces")
            console.log(selectedTraces)
            UpdateLoading(true);
        }, [selectedData, showLDC])


    //


    // update vertical line when new timestamp
    //useEffect(()=>{
    //  console.log("these are the chart traces")
    //  console.log(chartTraces)

    //  if (chartTraces && chartTraces?.labels){


    //      try {
    //        var labels = chartTraces?.labels
    //        var vertline = createVerticalLine(index, labels)
    //        var combined = chartTraces;

    //        combined.datasets.pop()

    //        combined.datasets.push(vertline)
    //        updateTraces(combined)
    //      }
    //      catch{
    //        console.log("failed to load timeseries")

    //      }

    //  }

    //},[chartTraces, index])

    return (

      <div id='timeseriesChart'>
        { ready &&
        <div>

        { visible &&

        <div>
        <div id='timeseriesButtons'>
          <button id='LDCButton' class='button' type='checkbox' value={showLDC} checked={showLDC} onClick={()=>toggleLDC()}>Load Duration Curve</button>
        </div>

        <div id='seriesChart'>

          <div>
          {showSelected &&

            <Line
            id='lineChart' data={selectedTraces} options={options}
            width={document.getElementById('timeseriesChart').clientWidth*0.95}
            height={document.getElementById('timeseriesChart').clientHeight*0.9}
            />
          }
          </div>
          <div>
            {!showSelected &&
          <Line
          id='lineChart' data={chartTraces} options={options}
          width={document.getElementById('timeseriesChart').clientWidth*0.95}
          height={document.getElementById('timeseriesChart').clientHeight*0.9}
          />
          }
          </div>



        </div>
        </div>
        }
        </div>
      }
    </div>
  )
}

