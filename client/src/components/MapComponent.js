import React, { useState } from 'react';
import { GoogleMap, LoadScript, StandaloneSearchBox } from '@react-google-maps/api';

const libraries = ["places"];

const MapComponent = () => {
  const [coordinates, setCoordinates] = useState(null);

  const onPlacesChanged = (searchBox) => {
    const places = searchBox.getPlaces();
    const place = places[0];
    setCoordinates({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
    // You can then send these coordinates to the backend
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY" libraries={libraries}>
      <GoogleMap
        // initial map configuration
      >
        <StandaloneSearchBox onPlacesChanged={onPlacesChanged}>
          <input type="text" placeholder="Enter address" />
        </StandaloneSearchBox>
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
