import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import Paper from "@mui/material/Paper";
import {useTheme} from "@mui/material/styles"
function makeLabels(list){
  var i = 1;
  var options = []
  for (const l in list){
    options.push({id: i, name:list[l]})
    i = i+1;
  }

  console.log("these are the options")
  console.log(options)
  return options
}


// TODO should take USER as an input
async function listProjects(){

  const response = await fetch(`/api/projects`)
  const data = await response.json()

  return makeLabels(data)
}

async function listScenarios(project){
  console.log("Selected Project")
  const p = project
  console.log(project)
  const response = await fetch(`/api/projects/${p}`)
  const data = await response.json()

  return makeLabels(data)
}


//TODO pass in USER info for scenario picker.
export default function ScenarioPicker({scenarioProp, onChange}){

  const theme = useTheme();
  const [allProjects, updateAllProjects] = useState([{id:1, name:"Pick A Project"}]);
  const [allScenarios, updateAllScenarios] = useState([{id:1, name:"Pick A Scenario"}]);

  useEffect(() => {

    listProjects().then( data=> {updateAllProjects(data) })
    console.log("these are the projects")
    console.log(allProjects)
  }, [])

  useEffect(()=>{
    console.log("updating list of scenarios");
    listScenarios(scenarioProp.project).then(data=> {updateAllScenarios(data)})
  }, [scenarioProp.project])

  //useEffect(()=>{
  //  onChange({...scenarioProp, scenario: allScenarios[0].name})
  //},[allScenarios])

  const handleProjectChange = (event) => {
    console.log("Project change detected");
    console.log(event.target.value);
    onChange({...scenarioProp, project: event.target.value});
  };

  const handleScenarioChange = (event) => {
    console.log("Scenario change detected")
    onChange({...scenarioProp, scenario: event.target.value});
  }
  return (
    <Paper sx={{minWidth: 500, width:'100%', borderRadius:2}}>
     <Box sx={{mb:2}}>
      <Typography align='center' variant='h4' bgcolor="primary.main" color="primary.contrastText" borderRadius={2}>
        Projects and Scenarios
      </Typography>
      </Box> 
    <Stack direction="row" spacing={3} divider={<Divider orientation="vertical" flexItem />}>
    <Box sx={{ width: '40%' }}>
      <FormControl fullWidth  >
        <InputLabel id="demo-simple-select-label">Project</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={scenarioProp.project}
          label="Project"
          onChange={handleProjectChange}
        >
          {allProjects.map((project)=>(
            <MenuItem value={project.name}>
              {project.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>

    <Box sx={{  width: '40%'  }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select2-label">Scenario</InputLabel>
          <Select
            labelId="demo-simple-select2-label"
            id="demo-simple-select2"
            value={scenarioProp.scenario}
            label="Scenario"
            onChange={handleScenarioChange}
          >
            {allScenarios.map((scenario)=>(
              <MenuItem value={scenario.name}>
                <Typography variant="subheading" noWrap={false}>
                {scenario.name}
                </Typography>
                </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      </Stack>
    </Paper>

  );

}