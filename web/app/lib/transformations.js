export const ZONE_COLORS = {
    'FRCC': [201, 192, 77,20],
    'NTTG': [100,100,100,20],
    'SERTP':[93, 110, 141,20],
    "NYISO":[121, 105, 214,20],
    "CAN":[100,100,100,20],
    "CAISO":[141, 172, 230,20],
    "PJM":[116, 179, 107,20],
    "ISONE":[97, 141, 93,20],
    "ERCOT":[230, 141, 141,20],
    "MISO":[214, 105, 187,20],
    "SPP":[61, 102, 180],
    "MEX":[100,100,100,20],
    "ColumbiaGrid":[100,100,100,20],
    "WestConnect":[20, 90, 50, 20],
  }

export const MW_CONV = {
    'MW': 1.0,
    'GW': 1000,
    'TW': 1000000
}

export const GEN_MAP = {
    'Nuclear':[50,50,200], //[130, 0, 0],
    'Coal':[200,50,50], //[34, 34, 34], R
    'Gas': [50,200,50], //[194, 161, 219], G
    'NG':[194, 161, 219],
    'Gas-CT':[194, 161, 219],
    'NG-CT':[194, 161, 219],
    'Gas/OCGT':[194, 161, 219],
    'Gas-CC':[82, 33, 107],
    'NG-CC':[82, 33, 107],
    'Gas/CCGT':[82, 33, 107],
    'Gas/ST':[166, 40, 164],
    'Oil':[61, 51, 118],
    'Oil Shale':[133, 61, 101],
    'Landfill-Gas': [91, 152, 68],
    'Waste': [136, 186, 65],
    'Biomass': [91, 152, 68],
    'PHS':[24, 28, 148],
    'Hydro':[24, 127, 148],
    'Marine':[169, 98, 53],
    "Wind":[0, 182, 239],
    'Onshore Wind':[0, 182, 239],
    'Offshore-Wind':[16, 107, 167],
    'Offshore Wind':[16, 107, 167],
    "Land-based Wind":[0, 182, 239],
    "Wind&PV":[80, 200, 120],
    "Wind/PV":[80, 200, 120],
    "Wind/Solar":[80, 200, 120],
    "PV": [50,200,50], //[255, 201, 3],
    "Solar PV": [255, 201, 3],
    "dPV":[255, 171, 2],
    'Rooftop PV':[255, 171, 2],
    "VRE":[127, 195, 64],
    'Battery':[255, 74, 136],
    'Other':[255, 127, 187],
    'Curtailment':[225,225,225],
    'Demand':[0,0,0],
}


export const COLOR_MAP = {
    0.0:[ 94, 79, 162],
    0.1:[ 50, 134, 188 ],
    0.2:[ 102, 194, 165],
    0.3:[169, 220, 164],
    0.4:[230, 245, 152],
    0.5:[254, 254, 189],
    0.6:[254, 224, 139],
    0.7:[252, 172,96],
    0.8:[244, 109, 67],
    0.9:[211,61,79],
    1.0:[158,1,66]
}


export function createFlags(geojson, property){
    console.log("processing flags")
    var flags = {};
    var features = geojson['features'];
    for(var index in features){

        var flag = features[index].properties[property]
        flags[flag] = true
    }
    return flags;

}

export function createDropdownOptions(flags){
    var availableOptions = new Array();
    var i = 1;
    if (flags){
        for (const key of Object.keys(flags)) {
            var option = {"name": key, id:i}
            availableOptions.push(option);
            i = i+1;
        }
    }

    return availableOptions;
}


export function setLineColor(current_flow, rating, threshold) {
    //Take current rating from geojson
    var current_load = Math.abs(current_flow)/rating;

    var scaled_load = Math.round(current_load*10)/10
    if (scaled_load in COLOR_MAP){

        if (scaled_load >= threshold){
            return COLOR_MAP[scaled_load]
        }
        else{
            var line_color = COLOR_MAP[scaled_load];

            return [line_color[0], line_color[1], line_color[2], 10]
        }
    }
    else {
        if (scaled_load > 1.0){
            return COLOR_MAP[1.0]
        }
        else{
            return [169,169,169,10]
        }
    }
};


export function setFlowColor(current_flow, rating, threshold, direction, showFlow) {
    //Take current rating from geojson
    //
    const color =  setLineColor(current_flow, rating, threshold)

    if (Math.sign(current_flow) == Math.sign(direction)) {
        return color
    }
    else{

        // TODO this appears to be reversed from what it should be...
        if (showFlow){
            return [50,50,50,20]
        }
        else
        {
            return color
        }
    }

};





export function setLineWidth(flow, visible) {
    if (visible){
        return Math.abs(flow)
    }
    else{
        return 0.0
    }
}

export function setElevation(volt) {
    return Math.round(volt)
}


export function setGeneratorColor(gen_type){
    return GEN_MAP[gen_type]
}

export function setGeneratorRadius(gen_mw, curt_mw, selected_gen){

    if (selected_gen){
        var tot_mw = gen_mw + curt_mw;
        var outer_radius = Math.sqrt(tot_mw/Math.PI) //r2
        return outer_radius
    }
    else {
        return 0.0
    }

  }

export function setGeneratorLineWidth(gen_mw, curt_mw, selected_gen) {

    if(selected_gen){
        var tot_mw = gen_mw + curt_mw;
        var outer_radius = Math.sqrt(tot_mw/Math.PI) //r2
        var inner_radius = Math.sqrt(gen_mw/Math.PI)
        var radius_diff = outer_radius - inner_radius
        return radius_diff;
    }
    else {
        return 0.0
    }
  };



export function geoToArc(geojson){

    //


}