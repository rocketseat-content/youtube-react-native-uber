import React from "react";
import MapViewDirections from "react-native-maps-directions";

const Directions = ({ destination, origin, onReady }) => (
  <MapViewDirections
    destination={destination}
    origin={origin}
    onReady={onReady}
    apikey="AIzaSyB1O8amubeMkw_7ok2jUhtVj9IkME9K8sc"
    strokeWidth={3}
    strokeColor="#222"
  />
);

export default Directions;
