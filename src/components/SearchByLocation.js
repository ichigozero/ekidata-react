import React, {Component} from 'react';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form';

import L from 'leaflet';
import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css'

import '../css/SearchByLocation.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

class SearchByLocation extends Component {
  constructor() {
    super();

    this.state = {
      form: {
        latitude: 35.655164046,
        longitude: 139.740663704,
        distance: '1.0',
      },
    };

    this.state['map'] = {
      ...this.state.form,
      stations: []
    };
  }

  getApiUri({longitude, latitude, distance}) {
    return (
      '/ekidata/api/v2.0' +
      '/longitude/' + longitude +
      '/latitude/' + latitude +
      '/max-distance/' + distance +
      '/stations'
    );
  }

  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      form: {
        ...this.state.form,
        [name]: value,
      }
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    this.setState({
      map: {
        ...this.state.form,
        stations: []
      }
    });

    const apiUri = this.getApiUri(this.state.form);

    fetch(apiUri)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          map: {
            ...this.state.map,
            stations: data.stations,
          }
        });
      });
  }

  render() {
    const {latitude, longitude, stations} = this.state.map;
    const position = [latitude, longitude];

    function placeMarkers() {
      let markers = [];

      function showLineNames(lines) {
        const lineNames = [];

        for (const key in lines) {
          const lineName = <div>・{lines[key]}</div>
          lineNames.push(lineName);
        }

        return lineNames;
      }

      stations.forEach((station) => {
        const {common_name, distance, lines} = station;
        const {latitude, longitude} = station.location;
        const marker = (
          <Marker position={[latitude, longitude]}>
            <Popup>
              <h5>{common_name}駅</h5>
              <div className="mt-1">距離: {distance.toFixed(2)}km</div>
              <div>
                <div>線路:</div>
                {showLineNames(lines)}
              </div>
            </Popup>
          </Marker>
        );
        markers.push(marker);
      });

      return markers;
    };

    return (
      <>
        <div className="row">
          <p>緯度と経度を入力し最寄り駅を検索</p>
        </div>
        <div className="row">
          <div className="col px-0">
            <Form onSubmit={this.handleSubmit}>
              <Form.Row>
                <Form.Group as={Col} controlId="latitude">
                  <Form.Label>緯度</Form.Label>
                  <Form.Control
                    name="latitude"
                    placeholder="35.655164046"
                    onChange={this.handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="longitude">
                  <Form.Label>経度</Form.Label>
                  <Form.Control
                    name="longitude"
                    placeholder="139.740663704"
                    onChange={this.handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>距離</Form.Label>
                  <Form.Control
                    name="distance"
                    as="select"
                    defaultValue="1km以内"
                    onChange={this.handleChange}
                  >
                    <option value="1.0">1km以内</option>
                    <option value="5.0">5km以内</option>
                    <option value="10.0">10km以内</option>
                    <option value="20.0">20km以内</option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>
              <Button variant="primary" type="submit">検索</Button>
            </Form>
          </div>
        </div>
        <div className="row mt-4">
          <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
            <UpdateMap position={position}/>
            <TileLayer
              attribution='
                &copy;
                <a href="http://osm.org/copyright">OpenStreetMap</a>
                contributors
              '
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}/>
            {placeMarkers()}
          </MapContainer>
        </div>
      </>
    );
  }
}

function UpdateMap({position}) {
  const map = useMap();
  map.panTo(position);
  return null;
}

export default SearchByLocation;
