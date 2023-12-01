const GEN_MAP = {
    "Solar":[255, 201, 3, 80],
    "Wind":[0, 182, 239, 80]
}

const COLOR_MAP = {
    0.0:[ 94, 79, 162, 80],
    0.1:[ 50, 134, 188, 80 ],
    0.2:[ 102, 194, 165, 80 ],
    0.3:[169, 220, 164, 80 ],
    0.4:[230, 245, 152, 80 ],
    0.5:[254, 254, 189, 80 ],
    0.6:[254, 224, 139, 80 ],
    0.7:[252, 172,96, 80],
    0.8:[244, 109, 67, 80],
    0.9:[211,61,79, 80],
    1.0:[158,1,66,80]
}

export function createFlags(geojson, property){
    console.log("processing voltages")
    var voltage_flags = {};
    var features = geojson['features'];
    for(var index in features){

        var voltage = features[index].properties[property]
        voltage_flags[voltage] = true
    }

    return voltage_flags;

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
        var tot_mw = gen_mw + curt_mw
        var outer_radius = Math.sqrt(tot_mw/Math.PI) //r2
        return Math.round(outer_radius)
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
        return Math.round(outer_radius-inner_radius)
    }
    else {
        return 0.0
    }
  };

