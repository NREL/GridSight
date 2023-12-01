import React from 'react';
import Plot from 'react-plotly.js'




class PlotlyApp extends React.Component{
    constructor(props){
        super(props);


        this.state = {
            selectedTRX: [], // Dictionary of arrays - one array per line
            selectedGen: [], // Dictionary of Generators - one array per generator type

        }

        window.api.receive("selectedTRX", (message)=> {
          console.log("new selected TRX")

          // Invoke a call to the selected data.
          // get dictionary of timeseries data

          // update the plotly plot accordingly.
          this.selectedTRX = message;

          console.log(this.selectedTRX);

        });

    }

    onSelectedTRX() {
      console.log('open TRX channel')
    }

    onTrxUpdate(){
        //
        console.log('test trx comms')

    }

    render() {

        return (
            <Plot
            data={[
              {
                x: [1, 2, 3],
                y: [2, 6, 3],
                type: 'scatter',
                mode: 'lines+markers',
                marker: {color: 'red'},
              },
              {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
            ]}
            layout={ { title: 'A Fancy Plot'} }
            //layout={ {width: 320, height: 240, title: 'A Fancy Plot'} }
          />
        );


    }

}

export default PlotlyApp