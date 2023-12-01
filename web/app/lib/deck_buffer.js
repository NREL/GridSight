// use gpu js for array computation

// use as a web worker.


// object should be initialized per pipeline/scenario




function getData(url){

    // based on the data being fetched (transmission vs generation),
    // url might change
    // split out data url per layer

}


class layerBufferObject {
    // Goal: have an object responsible for buffering time series and pre-computing
    // attribute values.

    // ----------------------
    // init based on scenario

    // compute pipeline

    // get deckgl layer (will need props for this)

    // State Objects ----

    // Current buffer? (The data that should be displayed)
    // Compiled Kernels
    constructor(project, scenario){

        // raw data buffer

        // Luma gl buffer

        // Current buffer sizes

        // controls for layer visibility
        // controls for selected asset types

        // static buffers/textures of data like Voltage, Generator Type, etc.
        // Keep the buffers in memory

        // buffer of current values. When user toggles visibility or filters, should be ready to calculate.

    }


    getDeckLayer() {
        // Get Deck Layer with attributes

        // buffers of data representing current size/color/

    }

    getNext(){
        // gets the next item in the buffer
    }

    calcVisibleAssets(){
        // determines which

        // Array of Types
        // returns array of boolean

    }

    calcRadius(output_size){



    }
    calcCurtWidth(){

    }

    calcLineWidth(){

    }

    calcLineColor(){

    }


}