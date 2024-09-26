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
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LayersIcon from '@mui/icons-material/Layers';
import MapIcon from '@mui/icons-material/Map';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { positions } from '@mui/system';
import ClockView from './views/ClockView.js'
import Draggable from 'react-draggable';

const drawerWidth = 240;


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


async function getScenarioMetadata(project, scenario){

    // returns a list of layer object metadata.

    // Data/Timeseries Routes
    // and color maps styling is passed to

    // layer routes and Data Objects are passed to layer generators.

    const response = await fetch(`/api/${p}/${s}/layers`)
    const data = await response.json();
    return data;
}


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
    // Message Bus for sync between tabs/windows.
    // get metadata showing everything available to the user
    // User State

    var user = {
        username: "Demo",
        AdminRoles:['roleObject'],
        shared:[], // list of shared resources

    }

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

    useEffect(()=>{
        console.log("change in scenario state");
        console.log(scenarioState);
        //getScenarioMetadata(scenarioState.project, scenarioState.scenario).then(data=>updateLayerObjects(data));
    }, [scenarioState])


    var scenarioLayerProps = [

        {
            name:'Gen Layer',
            gridType: 'VRE or GEN or TRX, etc.',
            deckType: "GeoJsonLayer",
            geoPath: '/route/to/geo',

            timeseriesPaths: [
                {name:'series1', route:'/route/to/timeseries/1' },
                {name:'series2', route:'/route/to/timeseries/2' },
            ],
            // FEATURE REQUEST: add static files that you can style with
            //
            staticPaths:'/route/to/static/props',

            //Styling options common to all layer types.
            visible: true,
            pickable: false,

            pointStyles: {
                SizeType: 'single',//static or dynamic
                StaticSources:['static_file_1', 'static_file_2'],
                StaticSourceColumns: ['column1', 'column2'],
                DynamicSources:['timeseries_file_1', 'timeseries_file_2'],
                Size: 1, // if 'single' use as numeric, else, use as index in Sources above
                Scale: 1,
                Units: 'meters',//'common', or 'pixels'
                MinPixels: 0,
                MaxPixels: 100,
                pointAntialiasing: true,
                pointBillboard: false,

            },
            // common to all
            lineStyles: {
                SizeType: 'single',//static or dynamic
                StaticSources:['static_file_1', 'static_file_2'],
                StaticSourceColumns: ['column1', 'column2'],
                Size:1, //single, Static array, dynamic array,
                Scale:1,
                Units:'meters', //'common', or 'pixels'
                MinPixels:0,
                MaxPixels:1000,
                lineMiterLimit:4,
                lineCapRounded:false,
                lineJointRounded: false,
                lineBillboard: false,

            },
            arcStyles:{
                sourceColor:[[0,255,0]],
                targetColor:[[255,0,0]],
            },

            // Custom Stylings
            // TRX utlization threshold
            //
            additionalStyling:{
                property1: ['test']
            },
            // create a set of dynamic filters based on
            // properties in geojson.
            filters:{
                property1: ['test']
            },

        },

        {
            name:'TRX Layer',
            gridType: 'VRE or GEN or TRX, etc.',
            deckType: 'ArcLayer',
            geoPath: '/route/to/geo',

            timeseriesPaths: [
                {name:'series1', route:'/route/to/timeseries/1' },
                {name:'series2', route:'/route/to/timeseries/2' },
            ],
            // FEATURE REQUEST: add static files that you can style with
            //
            staticPaths:'/route/to/static/props',

            //Styling options common to all layer types.
            visible: true,
            pickable: false,
            pointStyles: {
                Source: 'single',//static or dynamic
                StaticSources:['static_file_1', 'static_file_2'],
                StaticSourceColumns: ['column1', 'column2'],
                DynamicSources:['timeseries_file_1', 'timeseries_file_2'],
                Size: 1, // if 'single' use as numeric, else, use as index in Sources above
                Scale: 1,
                Units: 'meters',//'common', or 'pixels'
                MinPixels: 0,
                MaxPixels: 100,
                pointAntialiasing: true,
                pointBillboard: false,

            },
            // common to all
            lineStyles: {
                Source: 'single',//static or dynamic
                StaticSources:['static_file_1', 'static_file_2'],
                StaticSourceColumns: ['column1', 'column2'],
                Size:1, //single, Static array, dynamic array,
                Scale:1,
                Units:'meters', //'common', or 'pixels'
                MinPixels:0,
                MaxPixels:1000,
                lineMiterLimit:4,
                lineCapRounded:false,
                lineJointRounded: false,
                lineBillboard: false,

            },
            arcStyles:{
                sourceColor:[[0,255,0]],
                targetColor:[[255,0,0]],
            },

            // Custom Stylings
            // TRX utlization threshold
            //
            additionalStyling:{
                property1: ['test']
            },
            // create a set of dynamic filters based on
            // properties in geojson.
            filters:{
                property1: ['test']
            },

        },


    ]


    const [layerProps, updateLayerProps] = useState(scenarioLayerProps);

    // Clock State (and index)
    var clockState = {
        startDate: "",
        endDate: "",
        playbackFrequency: 500, //ms between timesteps
        index: 0
    }


    const [currentTime, updateCurrentTime] = useState(150);

    //Animate timestep
    const [animate, showAnimate] = useState(true);
    const frameRate = 50;


    useEffect(() => {
        const interval = setInterval(() => {
        if (animate) {
                //console.log("updating time")
                updateCurrentTime((currentTime) => currentTime + 0.01);
              }
            }, frameRate);
            return () => clearInterval(interval);
          }, [animate]);

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
            //layers={[...staticlayers]}
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
            />
            </Box>
            }

            <Draggable defaultPosition={{x: 500, y: 500}} disabled={open} onStart={()=>setDeckControl(false)} onStop={()=>setDeckControl(true)}>
            <Box sx={{maxWidth: drawerWidth*3.5,maxHeight:'85%', color: '#000000', bgcolor: '#e2e2e2' }}>
              <ClockView/>
            </Box>
            </Draggable>
            </DeckGL>
        </Main>

        </Box>
      );




}