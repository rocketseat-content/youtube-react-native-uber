import React from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, Image, View, Dimensions } from "react-native";
import Geocoder from "react-native-geocoding";

import { getPixelSize } from "../../utils";

import Search from "../Search";
import Directions from "../Directions";
import Details from "../Details";

import markerImage from "../../../assets/marker.png";
import backimage from "../../../assets/back.png";

import {
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeSmal,
  Back
} from "./styles";
Geocoder.init("API KEY XXXXXXXXXXXX");
export default class Map extends React.Component {
  state = {
    region: null,
    destination: null,
    duration: null,
    location: null
  };
  async componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      //Sucesso
      async ({ coords: { latitude, longitude } }) => {
        const response = await Geocoder.from({ latitude, longitude });
        const address = response.results[0].formatted_address;
        const location = address.substring(0, address.indexOf(","));
        this.setState({
          location,
          region: {
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }
        });
      },
      //Erro
      () => {},
      {
        timeout: 5000,
        enableHighAccuracy: true,
        maximumAge: 1000
      }
    );
  }

  handleLocationSelected = (data, { geometry }) => {
    const {
      location: { lat: latitude, lng: longitude }
    } = geometry;

    this.setState({
      destination: {
        latitude,
        longitude,
        title: data.structured_formatting.main_text
      }
    });
  };

  handleBack = () => {
    this.setState({ destination: null });
  };

  render() {
    const { region, destination, duration, location } = this.state;

    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapStyle}
          region={region}
          showsUserLocation={true}
          loadingEnabled
          ref={el => (this.mapView = el)}
        >
          {destination && (
            <>
              <Directions
                origin={region}
                destination={destination}
                onReady={result => {
                  this.setState({ duration: Math.floor(result.duration) });
                  this.mapView.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: getPixelSize(50),
                      left: getPixelSize(50),
                      top: getPixelSize(50),
                      bottom: getPixelSize(350)
                    }
                  });
                }}
              />
              <Marker
                coordinate={destination}
                anchor={{ x: 0, y: 0 }}
                image={markerImage}
              >
                <LocationBox>
                  <LocationText>{destination.title}</LocationText>
                </LocationBox>
              </Marker>

              <Marker coordinate={region} anchor={{ x: 0, y: 0 }}>
                <LocationBox>
                  <LocationTimeBox>
                    <LocationTimeText>{duration}</LocationTimeText>
                    <LocationTimeSmal>MIN</LocationTimeSmal>
                  </LocationTimeBox>
                  <LocationText>{location}</LocationText>
                </LocationBox>
              </Marker>
            </>
          )}
        </MapView>
        {destination ? (
          <>
            <Details />
            <Back onPress={this.handleBack}>
              <Image source={backimage} />
            </Back>
          </>
        ) : (
          <Search onLocationSelected={this.handleLocationSelected} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  }
});
