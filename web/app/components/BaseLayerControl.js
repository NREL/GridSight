'use client';
import React, {useState} from 'react';
import Multiselect from 'multiselect-react-dropdown';
import {BASEMAP} from '@deck.gl/carto';

export default function BaseLayerController ({baseLayerProp, onLayerSelect}){

    function onSelect(val){
        console.log("new layer chosen")
        console.log(val)
        onLayerSelect(val)
    }


    // TODO prepopulate Available basemaps per project.
    const [availableBaseMaps, updateAvailBase] = useState([
        {id: 1, name: "DARK_MATTER", layer: BASEMAP.DARK_MATTER, isCarto:true, clearColor:[0,0,0,0]},
        {id: 2, name: "DARK_MATTER_NOLABELS", layer: BASEMAP.DARK_MATTER_NOLABELS, isCarto:true, clearColor:[0,0,0,0]},
        {id: 3, name: "POSITRON", layer: BASEMAP.POSITRON, isCarto:true, clearColor:[0,0,0,0]},
        {id: 4, name: "POSITRON_NOLABELS", layer: BASEMAP.POSITRON_NOLABELS, isCarto:true, clearColor:[0,0,0,0]},
        {id: 5, name: "VOYAGER", layer: BASEMAP.VOYAGER, isCarto:true, clearColor:[0,0,0,0]},
        {id: 6, name: "VOYAGER_NOLABELS", layer: BASEMAP.VOYAGER_NOLABELS, isCarto:true, clearColor:[0,0,0,0]},
        {id: 7, name: "CUSTOM", layer: "CUSTOM", isCarto:false, clearColor:[0,0,0.1,1]}
    ])



    return (
        <div id="BaseLayerController">

        <Multiselect
          id='BaseMultiSelect'
          class="MultiSelect"
          singleSelect={true}
          options={availableBaseMaps} // Options to display in the dropdown
          selectedValues={baseLayerProp} // Preselected value to persist in dropdown
          onSelect={(val) => onSelect(val)} // Function will trigger on select event
          onRemove={(val) => onSelect(val)} // Function will trigger on remove event
          displayValue="name" // Property name to display in the dropdown options
        />

        </div>



    )


}