import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


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

  const handleProjectChange = (event) => {
    console.log("Project change detected");
    console.log(event.target.value);
    onChange({...scenarioProp, project: event.target.value});
  };

  const handleScenarioChange = (event) => {
    onChange({...scenarioProp, scenario: event.target.value});
  }
  return (
    <div>
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Project</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={scenarioProp.project}
          label="Project"
          onChange={handleProjectChange}
        >
          {allProjects.map((project)=>(
            <MenuItem value={project.name}>{project.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>

    <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select2-label">Scenario</InputLabel>
          <Select
            labelId="demo-simple-select2-label"
            id="demo-simple-select2"
            value={allScenarios[0].name}
            label="Scenario"
            onChange={handleScenarioChange}
          >
            {allScenarios.map((scenario)=>(
              <MenuItem value={scenario.name}>{scenario.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </div>

  );

}