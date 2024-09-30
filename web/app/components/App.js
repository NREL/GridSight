'use client';
import Tray from './Tray.js';
import React, {useState, useEffect} from 'react';
import {BASEMAP} from '@deck.gl/carto';
import './app.css'

import DeckGL from '@deck.gl/react';
import {StaticMap} from 'react-map-gl';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
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
import { positions } from '@mui/system';
import ClockView from './views/ClockView.js'
import Draggable from 'react-draggable';

import {create_gen_layer2,create_vre_layer2, create_trx_arc_layer2, create_styling_object} from '../lib/layer_generators.js';
import {loadScenarioGeo, fetchScenarioTimeStep, getScenarioMetadata} from '../lib/loaders.js'

const drawerWidth = 240;


//TODOs

///// Layer Style Controls ////
// Opacity Slider
// Don't show point styles for Transmission layer
// Remove props from layer styler
// Filters for layers
// Other styling options (rounded lines)
// Slider for transmission utilization filter.

//// Style clock Controller. ///
// Enable start and end date functionality for clock
// Labels for each slider.

//// Style Movable Clock ////
// Stateful position (keeps resetting)
// min max position (relative)



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
      setDeckControl(!open)
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


    var gen_styles = create_styling_object('Generation Layer')
    var trx_styles = create_styling_object('Transmission Layer')


    const [layerProps, updateLayerProps] = useState([gen_styles, trx_styles]);

    const [clockState, updateClockState] = useState({
      startDate: "",
      endDateL: "",
      start_index: 1,
      end_index:8760,
      index: 5280,
      frequency: 750,
      animate: false,
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

    useEffect(()=> {
      loadScenarioGeo(scenarioState.project, scenarioState.scenario, 'transmission_map.geojson').then(data=> {updateTRX(data) ;});
      loadScenarioGeo(scenarioState.project, scenarioState.scenario,'vre_locs.geojson').then(data=> {updateVRE(data) ;});
      loadScenarioGeo(scenarioState.project, scenarioState.scenario,'nonvre_locs.geojson').then(data=> {updateGEN(data);})
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



    const [viewState, setViewState] = useState({
        latitude: 39.0,
        longitude: -104.0,
        zoom: 4,
      });


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
            newListItemOpen.basemap = !newListItemOpen.basemap;
        }
        else if (index == 3){
            newListItemOpen.animation = !newListItemOpen.animation;
        }
        console.log(newListItemOpen);
        console.log(event.target.value);
        updateListItemOpen(newListItemOpen);
    }

    const listIcons = [<AnalyticsIcon/>,<LayersIcon/>, <MapIcon/>,  <AccessTimeIcon/>]
    const listIconsBottom = [<ManageAccountsIcon/>, <SettingsIcon/>]

    return (
        <Box sx={{ display: 'flex' }}>
        <CssBaseline />
          <AppBar position="fixed" open={open}>
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
              {['Scenarios', 'Layers', 'Basemaps', 'Animation'].map((text, index) => (
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
            <DeckGL
            controller={deckControl}
            useDevicePixels={true}
            initialViewState={viewState}
            layers={layers}
            viewState={viewState}
            onViewStateChange={evt => setViewState(evt.viewState)}


            >
            <StaticMap id='mapbox' mapStyle={BaseLayer} reuseMaps={true}/>
            {
                open &&
            <Box sx={{maxWidth: drawerWidth*3.5,maxHeight:'85%', position:'absolute', left: drawerWidth*1.05, top: drawerWidth*0.5, color: '#000000', bgcolor: '#e2e2e2' }}>
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
            }

            <Draggable defaultPosition={{x: 500, y: 500}} disabled={open} onStart={()=>setDeckControl(false)} onStop={()=>setDeckControl(true)}>
            <Box sx={{width:'17%', color: '#d44811', bgcolor: '#00000000' }}>
              <h1>
                {currentTime}
              </h1>
            </Box>
            </Draggable>
            </DeckGL>
        </Main>

        </Box>
      );




}