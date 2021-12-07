import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import L from "leaflet";
import { useMap } from "react-leaflet";
import axios from 'axios';
import Layout from "components/Layout";
import Container from "components/Container";
import Map from "components/Map";
import Snippet from "components/Snippet";
const LOCATION = {
  lat: 38.9072,
  lng: -77.0369,
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;
const IndexPage = () => {
  // const markerRef = useRef();
  async function mapEffect(map) {
    let response;
    try {
      response = await axios.get('https://corona.lmao.ninja/v2/countries')
      console.log('@JAKE - here', response);
    } catch (error) {
      console.log('@JAKE - error', 'failed to fetch countries');
      return null;
    }
  
    const { data = [] } = response;
  
    const hasData = Array.isArray(data) && data.length > 0;
  
    if (!hasData) return;
  
    const geoJson = {
      type: 'FeatureCollection',
      features: data.map((country = {}) => {
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;
        return {
          type: 'Feature',
          properties: {
            ...country,
          },
          geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        }
      })
    }
  
    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;
        let updatedFormatted;
        let casesString;
  
        const {
          country,
          updated,
          cases,
          deaths,
          recovered
        } = properties
  
        casesString = `${cases}`;
  
        if (cases > 1000) {
          casesString = `${casesString.slice(0, -3)}k+`
        }
  
        if (updated) {
          updatedFormatted = new Date(updated).toLocaleString();
        }
  
        const html = `
          <span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${country}</h2>
              <ul>
                <li><strong>Confirmed:</strong> ${cases}</li>
                <li><strong>Deaths:</strong> ${deaths}</li>
                <li><strong>Recovered:</strong> ${recovered}</li>
                <li><strong>Last Update:</strong> ${updatedFormatted}</li>
              </ul>
            </span>
            ${casesString}
          </span>
        `;
  
        return L.marker(latlng, {
          icon: L.divIcon({
            className: 'icon',
            html
          }),
          riseOnHover: true
        });
      }
    });
  
    geoJsonLayers.addTo(map)
  
    return null;
  };
  const mapSettings = {
    center: CENTER,
    defaultBaseMap: "OpenStreetMap",
    zoom: DEFAULT_ZOOM,
    whenCreated: mapEffect
  };
  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <Map {...mapSettings}>
        {/* <MapEffect markerRef={markerRef} /> */}
        {/* <Marker ref={markerRef} position={CENTER} /> */}
      </Map>
      <Container type="content" className="text-center home-start">
        <h2>Still Getting Started?</h2>
        <p>Run the following in your terminal!</p>
        <Snippet>
          gatsby new [directory]
          https://github.com/colbyfayock/gatsby-starter-leaflet
        </Snippet>
        <p className="note">
          Note: Gatsby CLI required globally for the above command
        </p>
      </Container>
    </Layout>
  );
};
export default IndexPage;