'use client';
import {COLOR_MAP}  from '../lib/transformations';
import React from 'react';


export function arrayToRGB(arr){

    var r = arr[0]
    var g = arr[1]
    var b = arr[2]

    var color = `rgb(${r}, ${g}, ${b})`
    return color
}


export default function Colorbar() {

    return (
        <div id='Colorbar2' display='inline-flex' height='20px' width='100%' >
            <div className='colormap' background-color={arrayToRGB(COLOR_MAP[0.0])}>0.0</div>
            <div className='colormap' background-color={arrayToRGB(COLOR_MAP[0.1])}>1.0</div>
            <div className='colormap' background-color={arrayToRGB(COLOR_MAP[0.2])}>2.0</div>
            <div className='colormap' background-color={arrayToRGB(COLOR_MAP[0.3])}>3.0</div>
            <div className='colormap' background-color={arrayToRGB(COLOR_MAP[0.4])}>4.0</div>
            <div className='colormap' background-color={arrayToRGB(COLOR_MAP[0.5])}>5.0</div>
            <div className='colormap' background-color={arrayToRGB(COLOR_MAP[0.6])}>6.0</div>
            <div className='colormap' background-color={arrayToRGB(COLOR_MAP[0.7])}>7.0</div>
            <div className='colormap' background-color={arrayToRGB(COLOR_MAP[0.8])}>8.0</div>
            <div className='colormap' background-color={arrayToRGB(COLOR_MAP[0.9])}>9.0</div>
            <div className='colormap' background-color={arrayToRGB(COLOR_MAP[1.0])}>10.0</div>
        </div>
    )
}


