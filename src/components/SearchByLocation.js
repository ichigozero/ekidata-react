import React, {Component, useState, useEffect} from 'react';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form';

import L from 'leaflet';
import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css'

import '../css/LeafletMap.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const defaultLatitude = 35.655164046;
const defaultLongitude = 139.740663704;

class SearchByLocation extends Component {
  constructor() {
    super();

    this.state = {
      form: {
        latitude: defaultLatitude,
        longitude: defaultLongitude,
        distance: '1.0',
      },
      map: {
        latitude: defaultLatitude,
        longitude: defaultLongitude,
        stations: [],
      },
      validation: {
        latitude: true,
        longitude: true,
        distance: true,
      },
      showMessage: false,
    };
  }

  toggleMessage = () => {
    this.setState({
      showMessage: !this.state.showMessage
    });
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

    let isValid = true;

    if (name === 'latitude') {
      isValid = /^(4[0-5]|[2-3][0-9])\.?\d{0,8}$/.test(value);
    }

    if (name === 'longitude') {
      isValid = /^(15[0-3]|1[34][0-9]|12[2-9])\.?\d{0,8}$/.test(value);
    }

    const {form, validation} = this.state;

    form[name] = value;
    validation[name] = isValid;

    this.setState({form, validation});
  }

  handleSubmit = async(event) => {
    event.preventDefault();

    if (!Object.values(this.state.validation).every(Boolean)) return;

    const {form, map} = this.state;

    map.latitude = form.latitude;
    map.longitude = form.longitude;
    map.stations = [];

    const apiUri = this.getApiUri(this.state.form);

    await fetch(apiUri)
      .then((response) => response.json())
      .then((data) => {
        if ('stations' in data) {
          map.stations = data.stations;
        }
      })
      .catch((error) => {
        alert(error.message)
      });

    this.setState({map, showMessage: true});
  }

  render() {
    const {showMessage} = this.state;
    const {latitude, longitude, stations} = this.state.map;
    const position = [latitude, longitude];

    return (
      <>
        <div className="row">
          <p>緯度と経度を入力し最寄り駅を検索</p>
        </div>
        <div className="row">
          <div className="col px-0">
            <SearchForm
              formValue={this.state.form}
              validation={this.state.validation}
              handleChange={this.handleChange}
              handleSubmit={this.handleSubmit}
            />
          </div>
        </div>
        <UserMessage
          showMessage={showMessage}
          stations={stations}
          toggleMessage={this.toggleMessage}
        />
        <div className="row mt-2">
          <DisplayMap
            center={position}
            zoom={13}
            stations={stations}
          />
       </div>
      </>
    );
  }
}

function SearchForm({formValue, validation, handleChange, handleSubmit}) {
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Row>
        <Form.Group as={Col} controlId="latitude">
          <Form.Label>緯度</Form.Label>
          <Form.Control
            name="latitude"
            value={formValue.latitude}
            onChange={handleChange}
            isInvalid={!validation.latitude}
          />
          <Form.Control.Feedback type="invalid">
            20〜45の範囲で入力してください！
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} controlId="longitude">
          <Form.Label>経度</Form.Label>
          <Form.Control
            name="longitude"
            value={formValue.longitude}
            onChange={handleChange}
            isInvalid={!validation.longitude}
          />
          <Form.Control.Feedback type="invalid">
            122〜153の範囲で入力してください！
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>距離</Form.Label>
          <Form.Control
            name="distance"
            as="select"
            value={formValue.distance}
            onChange={handleChange}
          >
            <option value="1.0">1km以内</option>
            <option value="2.0">2km以内</option>
            <option value="5.0">5km以内</option>
            <option value="10.0">10km以内</option>
          </Form.Control>
        </Form.Group>
      </Form.Row>
      <Button variant="primary" type="submit">検索</Button>
    </Form>
  )
}

function UserMessage({showMessage, stations, toggleMessage}) {
  const [show, setShow] = useState(showMessage);

  useEffect(() => {setShow(showMessage)}, [showMessage])

  if (show) {
    let variant = 'danger';
    let message = 'お探しの駅が見つかりません！';
    const stationCount = stations.length;

    if (stationCount > 0) {
      variant = 'success';
      message = `${stationCount} 件見つかりました！`
    }

    return (
      <div className="row mt-4">
        <div className="col px-0">
          <Alert
            key={`alert-${variant}`}
            variant={variant}
            onClose={toggleMessage}
            dismissible
          >
            {message}
          </Alert>
        </div>
      </div>
    )
  }

  return null;
}

function DisplayMap({center, zoom, stations}) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false}>
      <UpdateMap position={center}/>
      <TileLayer
        attribution='
          &copy;
          <a href="http://osm.org/copyright">OpenStreetMap</a>
          contributors
        '
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker key="marker-1" position={center}/>
      <StationMarkers stations={stations}/>
    </MapContainer>
  )
}

function UpdateMap({position}) {
  const map = useMap();
  map.panTo(position);
  return null;
}

function StationMarkers({stations}) {
  let markers = [];

  function showLineNames(lines) {
    const lineNames = [];

    for (const [key, value] of Object.entries(lines)) {
      const lineName = <li key={key}>{value}</li>
      lineNames.push(lineName);
    }

    return lineNames;
  }

  stations.forEach((station, index) => {
    const {common_name, distance, lines} = station;
    const {latitude, longitude} = station.location;
    const marker = (
      <Marker key={`marker-${index + 2}`} position={[latitude, longitude]}>
        <Popup key={`popup-${index + 2}`}>
          <h5>{common_name}駅</h5>
          <div className="mt-1">距離: {distance.toFixed(2)}km</div>
          <div>
            <div>線路:</div>
            <ul className="px-3">
              {showLineNames(lines)}
            </ul>
          </div>
        </Popup>
      </Marker>
    );
    markers.push(marker);
  });

  return markers;
};

export default SearchByLocation;
