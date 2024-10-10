import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Draggable from 'react-draggable';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';



export default function AllPopouts(){

    useEffect(()=>{
        console.log("pop out box generated");
    },[])

    // want a list/array of all the various popouts we want.

    // Each popout component should contain a minimize and close-out button
    
    // Clock should be moved under popout.

    // All/most popouts should synchronize with the time state.

    // ViewType determines the type of view to use.

    var props = [{title: "test", component:"dispatch"},{title: "test2", component: "timeseries"}]

    // example 
    // [
    // {name: 'clock', isMinimized: false, viewType:"clock", other props:?}
    // {name: 'generator popout', isMinimized: false, viewtype:'generator', other_props:{props to pass into component} }
    //]

    return (
        props.map((popOutProps, index)=>(

            <Draggable defaultPosition={{x:500, y:500}}>
                <Box sx={{bgcolor:"#dc143c", width:300, height:300}}>
                    {(popOutProps.component == "dispatch") &&
                    <Paper >
                    <h2>{popOutProps.title}</h2>
                     </Paper>                  
                    
                    }
                </Box>
            </Draggable>
        ))
    )
};