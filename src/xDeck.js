import DeckGL from '@deck.gl/react';
import {GeoJsonLayer} from '@deck.gl/layers';
import { SelectionLayer } from '@nebula.gl/layers';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { saveAs } from 'file-saver';
import {PathStyleExtension} from '@deck.gl/extensions';
import React from 'react';
import Multiselect from 'multiselect-react-dropdown';


class DeckApp extends React.Component {
        constructor(props) {
            super(props);


            this.selectedFeatureIndexes = [];
            this.INITIAL_VIEW_STATE = {
                latitude: 39.0,
                longitude: -104.0,
                zoom: 4,
                bearing: 0,
                pitch: 30
            };

            this.initial_value = 4000
            this.DATA = {}
            //this._effects = [lightingEffect];

            this.COUNTRIES = JSON.parse(this.loadData('basemap.geojson'));
            this.TEST_GEO = JSON.parse(this.loadData('AC_Lines_simple.geojson'));
            this.ZONES = JSON.parse(this.loadData('transreg_WKT.geojson'))
            this.GEN = JSON.parse(this.loadData('generator_map.geojson'))



            this.GEN_MAP = {
                "Solar":[255, 201, 3, 80],
                "Wind":[0, 182, 239, 80]
            }

            this.COLOR_MAP = {
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

            this.state = {
                //selectionTool: SELECTIONTYPE.RECTANGLE,
                selectedData: [],
                action: false,
                timestep: this.initial_value,
                datetime: "",
                animate: false,
                animation: "",
                DATA: {},
                frameRate: 250,
                startDate: Date(2035,1,1,10,0),
                flowOffset: 0,
                //Multi-Select Filtering
                GenOptions: [{name:'Solar', id:1}, {name: 'Wind', id:2}],
                selectedGenOptions:{},
                TrxOptions: []

            //row: this.Test_data.get(10).toJSON()
            }


            this.getTimestep(this.initial_value)

        };


        playback_display(){
            if(this.state.animate){
                return "Stop"
            }
            else{
                return "Play"
            }
        }

        playback(){
            if (this.state.animate == false) {
                console.log("Starting animation")
                this.setState({
                    animate: true,
                    animation: setInterval(()=>this.updateTimestep(1), this.state.frameRate)
                })
            }
            else {
                console.log("clearing interval")
                clearInterval(this.state.animation)
                this.setState({
                    animate: false,
                })

            }

        }

        saveImage(){


            var canvas = document.getElementById("deckgl-overlay");
            var currentdate = this.state.datetime;
            var filename = `GridSight_${currentdate}.png`
            canvas.toBlob(function(blob) {
                saveAs(blob, filename);
            });
        }


        loadData(filename) {
            console.log("loading map")

            const data = api.sendSync("loadFile", filename)

            return data
        }

        async getTimestep(i){

            //console.log("querying timestep")

            var datapromise = api.invoke("getTimestep", i)

            datapromise.then((value) => {
                this.setState({
                    DATA: value,
                    datetime: value['generator'].DateTime,
                });
            })

        }


        updateSelected(data) {

            //this.selectedFeatureIndexes = data
            //console.log(data);
            console.log("entering selected TRX")

            var payload = []
            for (let i = 0; i < data.length; i++){
                payload.push(data[i].object.properties.LINE_ID)
            }
            // Send data to main
            api.send("sTRX", payload)

        }

        updateTimestep(i){

            const t = this.state.timestep;

            this.setState({
                timestep: t+i
            })
            this.getTimestep(this.state.timestep);

            //console.log(this.state.timestep);
        }



        updateState() {

            console.log('test');
            if (this.state.action === true) {
               this.setState({
                    action: false
                });
            }
            else {
                this.setState({
                    action: true
                });
            }
        };

        setLineColor(line_id, rating){

            //Take current rating from geojson

            var current_flow = Math.abs(this.state.DATA['line'][line_id]);
            var current_load = current_flow/rating;


            if (current_load >= 1.0){


                return this.COLOR_MAP[1.0]
            }
            else {
                var line_color = this.COLOR_MAP[Math.round(current_load*10)/10]

                if (current_load < 0.6){
                    line_color[3] = 10
                }

                return line_color

            }

        }

        setLineWidth(rating) {

            return Math.round(rating/5.0)
        }

        setElevation(volt) {
            return Math.round(volt)
        }

        setGeneratorColor(gen_id){

            return this.GEN_MAP[gen_id]
        }
        setGeneratorRadius(gen_id){

            if (gen_id in this.state.DATA['generator']){
                var tot_mw = this.state.DATA['generator'][gen_id] + this.state.DATA['curtailment'][gen_id];

                var outer_radius = Math.sqrt(tot_mw/Math.PI) //r2
                return Math.round(outer_radius)
            }
            else {
                return 0.00000
            }
        }

        setGeneratorLineWidth(gen_id){

            if (gen_id in this.state.DATA['curtailment']){

                var curt_mw = this.state.DATA['curtailment'][gen_id];
                var gen_mw = this.state.DATA['generator'][gen_id];

                var tot_mw = gen_mw + curt_mw;
                var outer_radius = Math.sqrt(tot_mw/Math.PI) //r2

                var inner_radius = Math.sqrt(gen_mw/Math.PI)

                return Math.round(outer_radius-inner_radius)
            }
            else {
                return 0.00000
            }
        }


        onDateTimeChange(val){
            console.log(val.value)
            if (val != null){
                console.log(val)

            //    this.setState({
            //        startDate: val
            //    }, () => console.log(this.state.dueDate))
            }
            //console.log(this.startDate)
            //this.startDate=val;
        }


        render() {


            const zone_layer = new GeoJsonLayer({
                id: 'zone',
                data: this.ZONES,
                filled: true,
                //extruded: true,
                lineWidthScale: 2,
                lineWidthMinPixels: 2,
                lineWidthMaxPixels: 20,
                getLineColor: [50,50,50],
                getFillColor: [30,30,30],
                //getTentativeFillColor:[0,0,0],
                autoHighlight: true,
                //material: {
                //    ambient: 0.2,
                //    diffuse: 0.5,
                //    shininess: 10,
                //    specularColor: [80, 10, 30]
                //  }

            });

            const trx_layer = new GeoJsonLayer({
                id: 'trx',
                data: this.TEST_GEO,
                filled: true,
                stroked: true,
                lineWidthScale: 15,
                lineWidthMinPixels: 2,
                lineWidthMaxPixels: 1000,
                lineCapRounded: true,
                getElevation: f => this.setElevation(f.properties.TO_VN),
                elevationScale:10,
                getLineWidth: f => this.setLineWidth(f.properties.RATE),
                getLineColor: f => this.setLineColor(f.properties.LINE_ID, f.properties.RATE),
                pickable: true,
                autoHighlight: true,
                //onClick: this.onClick,
                extensions: [new PathStyleExtension({dash: true})],
                getDashArray: [2, 2],
                dashJustified: true,
                updateTriggers: {
                    getLineColor: this.state.DATA,
                },
                transitions:{
                    getLineColor: {
                        duration: this.state.frameRate,
                    }
                },
                parameters: {
                    depthTest: false,
                  },
                highlightedObjectIndex: this.selectedFeatureIndexes
            });

            const gen_layer = new GeoJsonLayer({
                id: 'gen',
                data: this.GEN,
                filled: true,
                //extensions: [new CollisionFilterExtension()],

                lineWidthScale: 2000,
                lineWidthMinPixels: 0,
                lineWidthMaxPixels: 100000,
                getLineWidth: f => this.setGeneratorLineWidth(f.properties.GEN_ID),
                getLineColor: [225,225,225,50],
                getFillColor: f => this.setGeneratorColor(f.properties.RENEWABLE),
                getPointRadius: f => this.setGeneratorRadius(f.properties.GEN_ID),
                pointRadiusScale: 2000,
                pointRadiusMinPixels: 0,
                pointRadiusMaxPixels: 100000,
                pointType:'circle',
                //pickable: true,
                autoHighlight: true,
                //onClick: this.onClick,
                updateTriggers: {
                    getPointRadius: this.state.DATA,
                    getLineWidth: this.state.DATA
                },
                transitions:{
                    getPointRadius: {
                        duration: this.state.frameRate,
                    },
                    getLineWidth:{
                        duration: this.state.frameRate,
                    }
                },
                parameters: {
                    depthTest: false,
                  },
                highlightedObjectIndex: this.selectedFeatureIndexes
            });

            //const sun = new SunLight({
            //    timestamp: 1554927200000,
            //    color: [255, 0, 0],
            //    intensity: 1
            //  });


            const select_layer = new SelectionLayer({
                id: 'selection',
                selectionType: 'rectangle',
                onSelect: ({ pickingInfos }) => {
                  this.updateSelected(pickingInfos);
                },
                layerIds: ['trx'],
                getTentativeFillColor: () => [255, 0, 255, 100],
                getTentativeLineColor: () => [0, 0, 255, 255],
                getTentativeLineDashArray: () => [0, 0],
                lineWidthMinPixels: 3,
                visible: true
            });



            const layers = [ zone_layer, trx_layer, gen_layer]
            //const layers = [baselayer, zone_layer, trx_layer, gen_layer]
            if (this.state.action === true){
                console.log("entering selection mode")
                layers.push(select_layer)
            };

            //const [value, onChange] = useState(new Date());

            return (

                <DeckGL
                controller={true}
                initialViewState={this.INITIAL_VIEW_STATE}
                layers={layers}
                glOptions={{ preserveDrawingBuffer: true }}
                parameters={{
                    clearColor: [200, 200, 250,0.5]
                  }}
                >


                <div id='controller'>
                    <button onClick={() =>{
                        this.updateState()
                    }}>
                    Toggle selection layer
                </button>

                <button onClick={() => {
                    this.updateTimestep(-1)
                }}>
                Back
                </button>
                <button onClick={() => {
                this.updateTimestep(1)
                }}>
                Forward
                </button>
                <button onClick={() => {
                    this.playback()
                }}>
                {this.playback_display()}
                </button>
                <button onClick={() => {
                    this.saveImage()
                }}>
                Save Image
                </button>
                <Multiselect
                    options={this.state.GenOptions} // Options to display in the dropdown
                    selectedValues={this.state.selectedGenOptions} // Preselected value to persist in dropdown
                    onSelect={this.onGenSelect} // Function will trigger on select event
                    onRemove={this.onGenRemove} // Function will trigger on remove event
                    displayValue="name" // Property name to display in the dropdown options
                />

                <div id='CurrentDateTime'>{this.state.datetime}</div>


                </div>

                </DeckGL>

            )
        }

    }

export default DeckApp;