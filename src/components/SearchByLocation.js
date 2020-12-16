import React, {Component} from 'react';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form';

import L from 'leaflet';
import {MapContainer, TileLayer, Marker} from 'react-leaflet';
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
  state = {
    latitude: 35.655164046,
    longitude: 139.740663704,
    distance: 1,
  };

  handleSubmit() {
    return;
  }

  render() {
    const position = [this.state.latitude, this.state.longitude];

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
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="longitude">
                  <Form.Label>経度</Form.Label>
                  <Form.Control
                    name="longitude"
                    placeholder="139.740663704"
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>距離</Form.Label>
                  <Form.Control
                    name="distance"
                    as="select"
                    defaultValue="1km以内"
                  >
                    <option value="1">1km以内</option>
                    <option value="5">5km以内</option>
                    <option value="10">10km以内</option>
                    <option value="20">20km以内</option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>
              <Button variant="primary" type="submit">検索</Button>
            </Form>
          </div>
        </div>
        <div className="row mt-4">
          <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
            <TileLayer
              attribution='
                &copy;
                <a href="http://osm.org/copyright">OpenStreetMap</a>
                contributors
              '
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}/>
          </MapContainer>
        </div>
      </>
    );
  }
}

export default SearchByLocation;
