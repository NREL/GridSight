'use client';
import React, {useState, useEffect} from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
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
    PointElement,
    BarElement,
    LineController,
    ScatterController,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

//import { BarChart } from '@mui/x-charts/BarChart';
import { GEN_MAP, MW_CONV } from '../lib/transformations';
import './dispatch.css';

async function getDispatch(project, scenario, index){


    const p = project
    const s = scenario

    const response = await fetch(`/api/dispatch/${p}/${s}/${index}`)

    const data = await response.json();
    const parsed = JSON.parse(data);
    console.log("chart data");
    console.log(parsed);
    return JSON.parse(data)

}



async function getDispatchMeta(project, scenario){


    try{
        const p = project
        const s = scenario

        const response = await fetch(`/api/dispatch/${p}/${s}/meta`)

        const data = await response.json();

        console.log("Dispatch metadata");
        console.log(data);
        return data
    }
    catch (error) {
        console.error(error)
    }

}


function getColor(tech){
    if (tech in GEN_MAP){
        return `rgb(${GEN_MAP[tech][0]}, ${GEN_MAP[tech][1]}, ${GEN_MAP[tech][2]}, 0.8)`
    }
    else {
        return 'rgb(0,0,0, 0.8)'
    }

}




function createTrace(tech, values, unit, selected){

    var chartType = 'bar'
    var order = 2
    if (tech == 'Demand'){
        chartType = 'scatter'
        order = 1
    }


    var labels = []
    var yarr = []

    for (const [key, val] of Object.entries(values) ){


        if (selected.includes(key)) {
            labels.push(key)
            yarr.push(val/MW_CONV[unit])
        }

    }



    var trace = {
        type: chartType,
        label: tech,
        data: yarr,
        backgroundColor: getColor(tech),
        order: order
    }

    return [trace, labels]

}




function formatDispatch(dispatch, unit, selected) {
    var datasets = [];
    var labels = [];

    var selected_ents = [];
    for (var i in selected){

        selected_ents.push(selected[i].name)
    }

    for (const [tech, color] of Object.entries(GEN_MAP)){

        if (tech in dispatch){
            const values = dispatch[tech]

            const [trace, ilabels] = createTrace(tech, values, unit, selected_ents)
            datasets.push(trace)
            labels = ilabels
        }

    }
    var data = {
        labels, datasets: datasets
    }
    return data
}


function get_options(freq, unit, meta) {



    const max_mw = calc_Meta(meta)

    const tick_max = (Math.floor( (max_mw/1000)/1 ) + 1)*1

    const options = {
        indexAxis: 'y',
        maintainAspectRatio: false,
        scaleFontColor: "#FFFFFF",
        //aspectRatio: 0.3,
        plugins: {
          title: {
            display: false,
            text: 'Dispatch',
            font: {
                size:20
            }
          },

          legend: {
            display: true,
            reverse: false,
            position: 'bottom',
            align:'left',
            labels:{
                padding: 8,
                boxWidth: 20,
                useBorderRadius: true,
                borderRadius: 2
            }
          }
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
            min:0,
            max:tick_max,
            ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 45,

                // Include a dollar sign in the ticks
                callback: function(value, index, ticks) {
                    return `${value} ${unit}`;
                }
            }
          },

          y: {
            stacked: true,
          },
        },
        //
        animations: {
            tension: {
              duration: freq,
              easing: 'linear',
            }

      }


    }

    return options
}

function calc_Meta(meta){

    try {
        var max_dispatch = Math.max(...Object.values(meta.max_dispatch))
        var max_demand = Math.max(...Object.values(meta.max_demand))

        var max_mw = Math.max(...[max_demand, max_dispatch])

        return max_mw
    }
    catch (error){
        //console.error(error)
        return 1.0
    }

}

function get_multiselect_options(entities){

    var options = []
    try {
        for (var i = 0; i < entities.length; i++) {

            options.push({"name":entities[i], id:i})

        }
    }
    catch {

    }

    return options

}


export default function Dispatch({index, project, scenario, freq, visible}){

    const [dispatchData, updateDispatchData] = useState();

    const [dispatchMeta, updateMeta] = useState();
    useEffect(() => {
            getDispatchMeta(project, scenario).then(data => {updateMeta(data);})

    }, [scenario, visible])



    const [plotData, updatePlotData] = useState({datasets:[{data:[1,2,3]}]});
    //useState(layout, updateLayout) = useState({});

    const [showDispatch, updateShowDispatch] = useState(false);
    const [ready, updateReady] = useState(false);

    useEffect(()=>{

        try{
            if(dispatchMeta.entities.length > 0){
                updateReady(true)
            }
            else{
                updateReady(false)
            }
        }
        catch {
            updateReady(false)
        }

    }, [dispatchMeta, visible])



    const [unit, updateUnits] = useState('GW');
    const [options, updateOptions] = useState(get_options(freq, unit, dispatchMeta));

    useEffect(()=> {

        const new_options = get_options(freq, unit, dispatchMeta);
        updateOptions(new_options);
    }, [dispatchMeta])


    const [selectedRegions, updateSelected] = useState();

    const [showConfig, updateShowConfig] = useState(false);

    useEffect(()=>{
        try{
            return updateSelected(get_multiselect_options(dispatchMeta.entities))
        }
        catch{
            return
        }

    }, [dispatchMeta])

    function toggleDispatchFilters(){
        updateShowConfig(showConfig => !showConfig);
    }





    ChartJS.defaults.color = 'rgb(255,255,255)'


    useEffect(() => {

            getDispatch(project, scenario, index).then(data => {updateDispatchData(data);})

    }, [project, scenario, index, visible]);

    useEffect(() => {
        if (dispatchData) {
            var plotData = formatDispatch(dispatchData, unit, selectedRegions);

            updatePlotData(plotData);
        }
    }, [dispatchData, selectedRegions])

    return (

        <div id='dispatchChart'>

            { ready &&

                <div>


                { visible &&
                <div>

                <div id='dispatchChart2'>
                <Bar id='barChart' options={options} data={plotData}
                    width={300}
                    height={900}
                    />
                </div>
                </div>
                }
                </div>
            }
        </div>
    )
}

