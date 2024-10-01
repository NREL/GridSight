

export async function loadScenarioGeo(project, scenario, filename) {
    console.log("loading map")
    const response = await fetch(`/api/geo/${project}/${scenario}/${filename}`)
    const data = await response.json();
    return data

  }



export async function fetchDateRange(project, scenario){
  const response = await fetch(`/api/timeseries/${project}/${scenario}`);
  const data = await response.json();
  return data
}

export async function fetchScenarioTimeStep(project, scenario, index){

    const response = await fetch(`/api/timeseries/${project}/${scenario}/${index}`)
    const data = await response.json();
    return data;
  }


export async function getScenarioMetadata(project, scenario){

    // returns a list of layer object metadata.

    // Data/Timeseries Routes
    // and color maps styling is passed to

    // layer routes and Data Objects are passed to layer generators.

    const response = await fetch(`/api/${p}/${s}/layers`)
    const data = await response.json();
    return data;
}