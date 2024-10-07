'use client';
import Tray from './Tray.js';
import React, {useState, useEffect} from 'react';
import {BASEMAP} from '@deck.gl/carto';
import './app.css'
import Map, {useControl} from 'react-map-gl/maplibre';
import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import { styled, useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LayersIcon from '@mui/icons-material/Layers';
import MapIcon from '@mui/icons-material/Map';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import Draggable from 'react-draggable';

import {create_gen_layer2,create_vre_layer2, create_trx_arc_layer2, create_styling_object} from '../lib/layer_generators.js';
import {loadScenarioGeo, fetchScenarioTimeStep,fetchDateRange, getScenarioMetadata} from '../lib/loaders.js'
import * as transformations from '../lib/transformations.js';
import 'maplibre-gl/dist/maplibre-gl.css';

const drawerWidth = 240;

const nrelTheme = createTheme({
  palette:{
    primary: {
      main: "#0088CE",
      contrastText: "#FFFFFF"
    }

  }
});


///// Layer Style Controls ////
// Don't show point styles for Transmission layer
// Numeric filter for utilization.
// If enabled use utilization array and soft range

// Slider for transmission utilization filter.

//// Style clock Controller. ///
// Enable start and end date functionality for clock
// Labels for each slider.
// Start and End Date should update the start_index, index, and end_index

function DeckGLOverlay(props) {
  const overlay = useControl(() => new DeckOverlay(props));
  overlay.setProps(props);
  return null;
}


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}px`,
      variants: [
        {
          props: ({ open }) => open,
          style: {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
          },
        },
      ],
    }),
  );

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
      {
        props: ({ open }) => open,
        style: {
          width: `calc(100% - ${drawerWidth}px)`,

          marginLeft: `${drawerWidth}px`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      },
    ],
  }));

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));





export function App() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [deckControl, setDeckControl] = useState(true);

    useEffect(()=>{
      if (open){
        setDeckControl(false)
      }
      else {
        setDeckControl(true)
      }

    }, [open])

    const handleDrawerOpen = () => {
      setOpen(true);
    };

    const handleDrawerClose = () => {
      setOpen(false);
    };

    // Example Scenario State Object
    var tempScenarioState = {
        project: "DEMO",
        scenario: "DEMO"
    }
    const [scenarioState, updateScenarioState] = useState(tempScenarioState);

    const onSChange = (value) => {
        updateScenarioState(value);
    };

    // Tray Component allows users to adjust aspects of the scenario/layers

    // ClockView component, movable div that just displays the time.

    // Scenarios - List of scenario components, should adjust layout as more
    const [BaseLayer, updateBaseLayer] = useState(BASEMAP.DARK_MATTER);


    //Layer Objects




    const [clockState, updateClockState] = useState({
      timestamps:[],
      startDate: "2024-04-08T00:00",
      endDate: "2024-04-08T23:55",
      start_index: 0,
      end_index:8760,
      index: 5280,
      min_index:0,
      max_index:8760,
      frequency: 750,
      animate: false,
      showClock: false
    })


    const [index, updateIndex] = useState(clockState.index);
    useEffect(()=>{
      updateIndex(clockState.index)
    },[clockState.index])
    useEffect(() => {
      const interval = setInterval(() => {
      if (clockState.animate) {
              updateIndex((index)=>index+1);
            }
          }, clockState.frequency);
          return () => clearInterval(interval);
        }, [clockState.animate]);

    useEffect(()=>{
          if (index > clockState.end_index){
              updateIndex(clockState.start_index)
              updateClockState({...clockState, index: clockState.start_index})
          }
          else{
              updateClockState({...clockState, index: index})
          }
      }, [index])

    const [DATA, setData] = useState({})
    const [TRX, updateTRX] = useState();
    const [VRE, updateVRE] = useState();
    const [GEN, updateGEN] = useState();


    var gen_styles = create_styling_object('Generation Layer')
    var trx_styles = create_styling_object('Transmission Layer')

    const [layerProps, updateLayerProps] = useState([gen_styles, trx_styles]);

    /// Update Available layer filters
    /// TODO make this generic for each layer (variable number of layers)
    useEffect(()=>{

      if (GEN){
        var newLayerProps =  layerProps;
        const newGenerationOptions = transformations.createFlags(GEN,'TECH');
        const newVREOptions = transformations.createFlags(VRE, 'TECH')
        var newGenOptions = [...newGenerationOptions, ...newVREOptions]
        newLayerProps[0].filters.allCategories = newGenOptions;
        updateLayerProps(newLayerProps);

      }
    }, [GEN,VRE])

    useEffect(()=>{

      if (TRX){
        var newLayerProps =  layerProps;
        const newVoltageOptions = transformations.createFlags(TRX,'TO_VN');
        newLayerProps[1].filters.allCategories = newVoltageOptions;
        updateLayerProps(newLayerProps);
      }
    }, [TRX])


    useEffect(()=> {
      loadScenarioGeo(scenarioState.project, scenarioState.scenario, 'transmission_map.geojson').then(data=> {updateTRX(data) ;});
      loadScenarioGeo(scenarioState.project, scenarioState.scenario,'vre_locs.geojson').then(data=> {updateVRE(data) ;});
      loadScenarioGeo(scenarioState.project, scenarioState.scenario,'nonvre_locs.geojson').then(data=> {updateGEN(data);})

      fetchDateRange(scenarioState.project, scenarioState.scenario).then(data=>{
        var arr_len = data.DateTime.length;
        updateClockState({...clockState,
          //timestamps: data.DateTime,
          startDate: data.DateTime[0],
          endDate: data.DateTime[arr_len-1],
          end_index: arr_len - 1,
          max_index: arr_len -1,
          start_index: 0,
          min_index: 0,
          index: 1,
        })});
    },[scenarioState.scenario])

    const trx_layer = create_trx_arc_layer2(TRX, DATA, layerProps[1], clockState.frequency )
    const vre_layer = create_vre_layer2(VRE, DATA, layerProps[0], clockState.frequency)
    const gen_layer = create_gen_layer2(GEN, DATA, layerProps[0], clockState.frequency )

    const layers = [trx_layer, gen_layer, vre_layer]

    const [currentTime, setCurrentTime] = useState(150);
    useEffect(() => {
      //setLoading(true)

      fetchScenarioTimeStep(scenarioState.project, scenarioState.scenario, clockState.index).then(data =>{

        setData(data)
        var currentTime = 0
        if ('DateTime' in data['generation']){
          var currentTime = data['generation']['DateTime'].split('.')[0]
        }
        else if ('Timestamp' in data['generation']){
          var currentTime = data['generation']['Timestamp'].split('.')[0]
        }

        setCurrentTime(currentTime)
      })
    }, [scenarioState.scenario, clockState.index]);




    const [listItemOpen, updateListItemOpen] = useState({scenarios:false, layers:false, basemap:false, animation:false});

    function handleListItemClick(index, event){
        var newListItemOpen = {scenarios:false, layers:false, basemap:false, animation:false};

        if (index==0){
            newListItemOpen.scenarios = !newListItemOpen.scenarios;
        }
        else if (index == 1){
            newListItemOpen.layers = !newListItemOpen.layers;
        }
        else if (index == 2){
            newListItemOpen.animation = !newListItemOpen.animation;
        }
        console.log(newListItemOpen);
        console.log(event.target.value);
        updateListItemOpen(newListItemOpen);
    }

    const listIcons = [<AnalyticsIcon/>,<LayersIcon/>, <MapIcon/>,  <AccessTimeIcon/>]
    const listIconsBottom = [<ManageAccountsIcon/>, <SettingsIcon/>]


    const [clockPosition, updateClockPosition] = useState({x:700, y:175})
    const handleDragStop = (event)=>{
      setDeckControl(true)
      updateClockPosition({x: event.layerX, y: event.layerY});
    };

    // Map Size settings
    const [viewState, setViewState] = useState({
      latitude: 39.0,
      longitude: -104.0,
      zoom: 5,
      width: 1920,
      height: 1080
    });


    const adjustViewportforHiDPI = () => {


      if (typeof window !== 'undefined'){
        const pixelRatio = window.devicePixelRatio || 1;
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        console.log("screen resize detected");
        console.log([newWidth, newHeight]);
        setViewState({...viewState, width: newWidth, height: newHeight})
      }
    }

    useEffect(()=>{

      adjustViewportforHiDPI();
      if (typeof window !== 'undefined'){
        window.addEventListener('resize', adjustViewportforHiDPI);

        return () => window.removeEventListener('resize', adjustViewportforHiDPI);
      }


    },[])


    return (

        <Box sx={{ display: 'flex' }}>
          <link href='https://unpkg.com/maplibre-gl@v1.22.19/dist/maplibre-gl.css' rel='stylesheet' />
          <CssBaseline />
        <Map
              initialViewState={{
                latitude: viewState.latitude,
                longitude: viewState.longitude,
                zoom: viewState.zoom
              }}
          style={{width: viewState.width, height: viewState.height}}
          mapStyle={BaseLayer}
          >


          <AppBar id='appbar' position="fixed" open={open}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={[
                  {
                    mr: 2,
                  },
                  open && { display: 'none' },
                ]}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              {['Scenarios', 'Layers', 'Animation'].map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton key={index} onClick={(event)=>handleListItemClick(index, event)}>
                    <ListItemIcon>
                      {listIcons[index]}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {['User', 'Settings'].map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton disabled={true}>
                    <ListItemIcon>
                      {listIconsBottom[index]}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>
          <Main open={open}>
            <DrawerHeader />

          <DeckGLOverlay layers={layers}  interleaved />

            {
                open &&
            <ThemeProvider theme={nrelTheme}>
            <Box sx={{maxWidth: drawerWidth*3.5,maxHeight:'95%', position:'absolute', left: drawerWidth*1.05, top: drawerWidth*0.35 }}>
            <Tray
                trayFlags={listItemOpen}
                userState={'test'}
                baseLayerProp={BaseLayer}
                onBaseLayerChange={(val)=>updateBaseLayer(val)}
                scenarioProp={scenarioState}
                onScenarioChange={onSChange}
                layerProps={layerProps}
                onLayerPropChange={(val)=>updateLayerProps(val)}
                clockState={clockState}
                onClockChange={updateClockState}
            />
            </Box>
            </ThemeProvider>
            }



        </Main>
        <Box>
        {clockState.showClock &&
            <Draggable defaultPosition={clockPosition}  onStart={()=>setDeckControl(false)} onStop={handleDragStop}>
            <Box sx={{width:'17%', color: '#d44811', bgcolor: '#00000000' }}>
              <h1 id ='Clock'>
                {currentTime}
              </h1>
            </Box>
            </Draggable>
            }
        </Box>
        </Map>
        </Box>
      );




}