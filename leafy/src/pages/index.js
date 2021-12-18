import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import L from "leaflet";
import { useMap } from "react-leaflet";

import axios from 'axios';          // part 1
import { useTracker } from 'hooks';    // part 2
import { commafy, friendlyDate } from 'lib/util';    // part 2

import Layout from "components/Layout";
import Container from "components/Container";
import Map from "components/Map";
import Snippet from "components/Snippet";

import TableData from "../components/TableData";
import TableDataCountry from "../components/TableDataCountry";
import TableDataCountryP from "../components/TableDataCountryP";
import ChartCounty from "../components/ChartCounty";

var toggle = true;
function turn() {
  toggle = !toggle;
  
  console.log('now' + toggle);
  //map.invalidateSize()
  var v = document.getElementById("map1");
  var v2 = document.getElementById("map2");
  if (toggle) {
      v.style.display = "block";
      v2.style.display = "none";
  } else {
    v.style.display = "none";
    v2.style.display = "block";
  }
  
   
}


const LOCATION = {
  lat: 34.0522,
  lng: -118.2437,
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;


const IndexPage = () => {
  const { data: countries = [] } = useTracker({
    api: 'countries'
  });
  const { data: states = [] } = useTracker({
    api: 'states'
  });


  // console.log(useTracker({ api: 'states'}));
  // console.log(useTracker(states?.));
  const hasCountries = Array.isArray(countries) && countries.length > 0;

  console.log('@WILL -- warning: countries is null');
  if (countries) { 
    console.log('@WILL -- countries.length is: ', countries.length); 
  }

  const { data: stats = {} } = useTracker({ api: 'all' });
  
  const dashboardStats = [
    { primary:   { label: 'Total Cases',   value: commafy(stats?.cases) },
      secondary: { label: 'Per 1 Million', value: (stats?.casesPerOneMillion) }
    },
    { primary:   { label: 'Total Deaths',  value: commafy(stats?.deaths) },
      secondary: { label: 'Per 1 Million', value: (stats?.deathsPerOneMillion) }
    },
    { primary:   { label: 'Total Tests',   value: commafy(stats?.tests) },
      secondary: { label: 'Per 1 Million', value: (stats?.testsPerOneMillion) }
    },
    { primary:   { label: 'Active Cases',   value: commafy(stats?.active) },
      secondary: { label: 'Per 1 Million', value: (stats?.activePerOneMillion) }
    },
    { primary:   { label: 'Critical Cases',  value: commafy(stats?.critical) },
      secondary: { label: 'Per 1 Million', value: (stats?.criticalPerOneMillion) }
    },
    { primary:   { label: 'Recovered Cases',   value: commafy(stats?.recovered) },
      secondary: { label: 'Per 1 Million', value: (stats?.recoveredPerOneMillion) }
    },
      
    ];

    async function mapEffectCounties(map) { 

      console.log('MapEffect automatically called, calling axios.get()');
  
      let countiesResponse;
  
      try { 
        countiesResponse = await axios.get('https://disease.sh/v3/covid-19/jhucsse/counties');
      } catch(e) { 
        console.log('Failed to fetch countries: ${e.message}', e);
        return;
      }
  
      let countiesData = countiesResponse.data;
      console.log("Printing countiesData");
      console.log(countiesData);
  
      var data_filter = countiesData.filter( element => (element.coordinates.latitude && element.coordinates.longitude) && (element.coordinates.latitude != "" || element.coordinates.longitude != ""))
      console.log("Printing data_filter");
      console.log(data_filter)
  
      countiesData = data_filter
  
      const geoCountiesJson = {
        type: 'FeatureCollection',
        // features: countries.map((country = {}) => {    // part 2
        features: countiesData.map((county = {}) => {      // part 1
          const { coordinates = {} } = county;
          const { latitude, longitude } = coordinates;
          return {
            type: 'Feature',
            properties: {
              ...county,
              ...county.stats,
            },
            geometry: {
              type: 'Point',
      
              coordinates: [ parseFloat(longitude), parseFloat(latitude) ]
            }
          }
        })
      }
  
      const geoCountiesJsonLayers = new L.GeoJSON(geoCountiesJson, {
        pointToLayer: (feature = {}, latlng) => {
          const { properties = {} } = feature;
          let updatedFormatted;
          let casesString;
      
          const {
            confirmed,
            country,
            county,
            deaths,
            province,
            recovered,
            updatedAt,
          } = properties
      
          casesString = `${confirmed}`;
      
          if ( confirmed > 1000 ) {
            casesString = `${casesString.slice(0, -3)}k+`
          }
      
          if ( updatedAt ) {
            updatedFormatted = new Date(updatedAt).toLocaleString();
          }
      
          const html = `
            <span class="icon-marker">
              <span class="icon-marker-tooltip">
                <h2>${county}, ${province}</h2>
                <ul>
                  <li><strong>Confirmed:</strong> ${confirmed}</li>
                  <li><strong>Deaths:</strong> ${deaths}</li>
                  <li><strong>Last Update:</strong> ${updatedFormatted}</li>
                </ul>
              </span>
              ${ casesString }
            </span>
          `;
        
          return L.marker( latlng, {
            icon: L.divIcon({
              className: 'icon',
              html
            }),
            riseOnHover: true
          });
        }
      });
      
      geoCountiesJsonLayers.addTo(map)
    };
  
  
    async function mapEffectCountries(map) { 
  
      let response;
      console.log('MapEffect automatically called, calling axios.get()');
  
      try { 
        response = await axios.get('https://disease.sh/v3/covid-19/countries');
      } catch(e) { 
        console.log('Failed to fetch countries: ${e.message}', e);
        return;
      }
  
      console.log(response);
      const { data = [] } = response;
      console.log(data);
  
      const hasData = Array.isArray(data) && data.length > 0;
      if ( !hasData ) return;
      
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
              coordinates: [ lng, lat ]
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
            recovered,
          } = properties
      
          casesString = `${cases}`;
      
          if ( cases > 1000 ) {
            casesString = `${casesString.slice(0, -3)}k+`
          }
      
          if ( updated ) {
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
              ${ casesString }
            </span>
          `;
        
          return L.marker( latlng, {
            icon: L.divIcon({
              className: 'icon',
              html
            }),
            riseOnHover: true
          });
        }
      });
      console.log('@WILL -- about to complete geoJson');
      console.log(geoJson);
  
      geoJsonLayers.addTo(map);
    };

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: "OpenStreetMap",
    zoom: DEFAULT_ZOOM,
    whenCreated: mapEffectCountries,
  };

  const mapSettings2 = {
    center: CENTER,
    defaultBaseMap: "OpenStreetMap",
    zoom: DEFAULT_ZOOM,
    whenCreated: mapEffectCounties,
  };

  function drawMap() {
    if(toggle)
      return (<div className="map-adj"><Map {...mapSettings} /></div>);
    else
      return (<div className="map-adj"><Map {...mapSettings2} /></div>);
  }

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Immaculate Covid Tracker</title>
      </Helmet>
      <div>
      <ChartCounty/>
    </div>

    <div className="toggle">
        <button onClick={turn}>Country/County</button>
    </div>
    <div className="tracker">
      <div id="map1" className="map-adj"><Map {...mapSettings} /></div>
      <div id="map2" className="map-adj"><Map {...mapSettings2} /></div>
      
      <div className="tracker-stats">
        <ul>
          { dashboardStats.map(({ primary = {}, secondary = {} }, i ) => {
            return (
              <li key={`Stat-${i}`} className="tracker-stat">
              { primary.value && (
                <p className="tracker-stat-primary">
                  { primary.value }
                  <strong> { primary.label } </strong>
                </p>
              ) }
              { secondary.value && (
                <p className="tracker-stat-secondary">
                  { secondary.value } 
                  <strong> { secondary.label } </strong>
                </p>
              ) }
            </li>   
          );  
        }) }
      </ul>        
    </div>             
  </div> 
  <div className="tracker-last-updated">
    <p>Last Updated: { stats ? friendlyDate( stats?.updated ) : '-' } </p>
  </div>

  {/* <Container type="content" className="text-center home-start"> 
    <h3>It has  covid stats via markers on our map, and stas shown in a dashboard... lots of fun!</h3>
    </Container> */}
    
    <div className="table-wrap">
    <TableData/>
    <TableDataCountry/>
    <TableDataCountryP/>
    </div>
    <div className="link-wrap">
      <a href="https://disease.sh/docs/">DISEASE.SH API WEBSITE</a>
      <a href="https://disease.sh/v3/covid-19/countries">COUNTRY API</a>
      <a href="https://disease.sh/v3/covid-19/jhucsse/counties">COUNTY API</a>
    </div>
    <div className="author-wrap">
      <p>Website created by:</p>
      <p>Gavin Gray</p>
      <p>Prston Fawcett</p>
      <p>Isaac Estrada</p>
      <p>Eric Corona</p>
    </div>
  </Layout>
  
  );
};

export default IndexPage;


// class TableDataCountry extends Component {
//   state = {
//     countryData: 0,
//     countryTable: '',
//     chosenState: 'Alabama',
//   }
  
//   render() {
//     return (
//       //insert here
//     );
//   }
// }


// export default TableDataCountry