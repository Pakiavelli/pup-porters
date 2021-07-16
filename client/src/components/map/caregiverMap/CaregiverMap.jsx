/*global google */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import config from '../../../../../config.js';
import { GoogleMap, ScriptLoaded, useLoadScript, Marker, InfoWindow, Autocomplete } from '@react-google-maps/api';
import InfoWindowItem from './InfoWindowItem.jsx';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from "../../../contexts/AuthContext.js"
import { Typography, Button, Slide, Modal } from '@material-ui/core';
import Confirmation from './Confirmation.jsx';

const useStyles = makeStyles({
  outer: {
    display: 'flex',
    justifyContent: 'center',
  },
  head: {
    width: 700,
    marginBottom: '10%',
  },
  instruction: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: 75,
    fontWeight: 300,
  },

  button: {
    height: 100,
    width: 500,
    borderRadius: 50,
    boxShadow: '0 5px 10px 5px rgba(128,128,128, .3)',
    fontSize: 30,
    marginBottom: 50,
  },
  buttons: {
    margin: 50,
    marginLeft: '-25%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hello: {
    position: 'absolute',
    width: 300,
    backgroundColor: 'white',
  }
});

const containerStyle = {
  width: '70%',
  height: '70%',
  margin: 0,
  padding: 0,
};

function CaregiverMap(props) {
  const classes = useStyles();

  const { currentUser } = useAuth()

  const [markerCoord, setMarkerCoord] = useState(null);
  const [postedMarkers, setPostedMarkers] = useState([]);
  const [openWindow, setOpenWindow] = useState(false);
  const [iconImage, setIconImage] = useState('');
  const [open, setOpen] = useState(false);


  useEffect(() => {
    console.log("Fetching existing markers");
    axios.get('/availablePiles')
    .then((res) => {
      console.log(res);
      setPostedMarkers(postedMarkers.concat(res.data));
    })
    .catch((err) => {
      console.log(err);
    })
  }, []);


  const onMapClick = (event) => {
    setMarkerCoord({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

 const onSelect = (item) => {
  console.log(item)
  setOpenWindow(true);
};
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

const handleConfirm = () => {
  console.log("Handling confirm")

  const availablePile = {
    coords: markerCoord,
    caregiver_user_id: JSON.stringify(currentUser.uid),
  };

  console.log(availablePile);

  axios.post('/availablePiles', availablePile)
    .then((res) => {
      console.log(res);
      setMarkerCoord(null);
      setPostedMarkers(postedMarkers.concat([res.data]));
    })
    .catch((err) => {
      console.log(err);
    })
};

  const renderMap = () => {

    const markersToRender = markerCoord ? postedMarkers.concat({
      coords: markerCoord,
    }) : postedMarkers;
    console.log("rendering with");
    console.log(markersToRender);

    return (
      <div>
        <div className={classes.outer}>
          <div className={classes.head}>
            <Typography className={classes.instruction}>
            Place pup porter flag within 2” of pup pile</Typography>
          </div>
        </div>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={props.centerLocation}
          zoom={14}
          onClick={onMapClick}
        >
          {markersToRender.map((marker, index) => (

            <Marker
              key={index}
              position={marker.coords}
              onClick={() => onSelect(marker)}
              icon={{
                url: 'poop.png',
                scaledSize: new google.maps.Size(50, 50),
              }}
              animation={2}
            />
          ))}


        {/* {openWindow && markerCoord &&
        (
          <InfoWindow
            position={markerCoord}
            clickable={true}
            onCloseClick={() => setOpenWindow(false)}
          >
            <>
            <InfoWindowItem
              coordinates={markerCoord}
            />
            </>
          </InfoWindow>
        )} */}
        </GoogleMap>
        <div className={classes.buttons}>

        {markerCoord &&
        <React.Fragment>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              console.log('sending flag info')
              handleConfirm();
            }}>
            Confirm
          </Button>
          <Modal open={open} onClose={handleClose}>
          <Confirmation/>
        </Modal>
        </React.Fragment>

        }
        </div>
      </div>
    )
  }

  return props.googleApiLoaded ? renderMap() : <div>noooo</div>

};

export default CaregiverMap;

