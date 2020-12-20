import React, {Component} from 'react'

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import L from 'leaflet';
import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css'

import '../css/LeafletMap.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const prefectureApiUri = '/ekidata/api/v1.0/prefectures';

class SearchByPrefecture extends Component {
  constructor() {
    super()

    this.state = {
      prefectures: [],
      lines: {
        data: [],
        formEnabled: false,
      },
      stations: {
        data: [],
        formEnabled: false,
      },
      map: {
        station: null,
        render: false,
      },
    }
  }

  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    if (name === 'prefecture') {
      if (value === '') {
        this.setState({
          lines: {
            data: [],
            formEnabled: false
          },
        });
      } else {
        this.fetchLines(value);
      }

      this.setState({
        stations: {
          data: [],
          formEnabled: false
        }
      });
    } else if(name === 'line') {
      if (value === '') {
        this.setState({
          stations: {
            data: [],
            formEnabled: false
          }
        });
      } else {
        this.fetchStations(value);
      }
    } else {
      if (value === '') {
        this.setState({
          map: {
            station: null,
            render: false
          }
        });
      } else {
        const index = event.target.selectedIndex;
        const station = this.state.stations.data[index - 1];

        this.setState({
          map: {
            station: station,
            render: true
          }
        });
      }
    }
  }

  fetchLines = (prefectureId) => {
    const apiUri = `/ekidata/api/v1.0/prefectures/${prefectureId}/lines`;

    fetch(apiUri)
    .then(response => response.json())
    .then((data) => {
      if ('lines' in data) {
        this.setState({
          lines: {
            data: data.lines,
            formEnabled: true
          }
        });
      }
    })
    .catch((error) => alert(error.message));
  }

  fetchStations = (lineId) => {
    const apiUri = `/ekidata/api/v1.0/lines/${lineId}/stations`;

    fetch(apiUri)
    .then(response => response.json())
    .then((data) => {
      if ('stations' in data) {
        this.setState({
          stations: {
            data: data.stations,
            formEnabled: true
          }
        });
      }
    })
    .catch((error) => alert(error.message));
  }

  componentDidMount() {
    fetch(prefectureApiUri)
    .then(response => response.json())
    .then((data) => {
      if ('prefectures' in data) {
        this.setState({prefectures: data.prefectures})
      }
    })
    .catch((error) => alert(error.message));
  }

  render() {
    const {prefectures, lines, stations} = this.state;
    const {station, render} = this.state.map;

    return  (
      <>
        <div className="row">
          <p>都道府県で路線/駅を検索</p>
        </div>
        <div className="row">
          <div className="col px-0">
            <SearchForm
              prefectures={prefectures}
              lines={lines}
              stations={stations}
              handleChange={this.handleChange}
            />
          </div>
        </div>
        {render &&
        (
          <div className="row mt-4">
            <DisplayMap station={station} zoom={13}/>
          </div>
        )
        }
      </>
    );
  }
};

function SearchForm({prefectures, lines, stations, handleChange}) {
  return (
    <Form>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Control
            as="select"
            name='prefecture'
            defaultValue="都道府県を選択"
            onChange={handleChange}
          >
            <option value="">都道府県を選択</option>
            <OptionPrefectures prefectures={prefectures}/>
         </Form.Control>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Control
            as="select"
            name='line'
            defaultValue="路線を選択"
            disabled={!lines.formEnabled}
            onChange={handleChange}
          >
            <option key='prefecture-0' value="">路線を選択</option>
            <OptionLines lines={lines.data}/>
         </Form.Control>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Control
            as="select"
            name='station'
            defaultValue="駅を選択"
            disabled={!stations.formEnabled}
            onChange={handleChange}
          >
            <option value="">駅を選択</option>
            <OptionStations stations={stations.data}/>
         </Form.Control>
        </Form.Group>
      </Form.Row>
    </Form>
  )
}

function OptionPrefectures({prefectures}) {
  const options = [];

  prefectures.forEach((prefecture, index) => {
    const option = (
      <option
        key={`prefecture-${index + 1}`}
        value={prefecture.id}
      >{prefecture.name}
      </option>
    )
    options.push(option);
  });

  return options;
}

function OptionLines({lines}) {
  const options = [];

  lines.forEach((line, index) => {
    const option = (
      <option
        key={`line-${index + 1}`}
        value={line.id}
      >{line.common_name}
      </option>
    )
    options.push(option);
  });

  return options;
}

function OptionStations({stations}) {
  const options = [];

  stations.forEach((station, index) => {
    const option = (
      <option
        key={`station-${index + 1}`}
        value={station.id}
      >{station.common_name}
      </option>
    )
    options.push(option);
  });

  return options;
}

function DisplayMap({station, zoom}) {
  const position = [station.latitude, station.longitude];

  return (
    <MapContainer center={position} zoom={zoom} scrollWheelZoom={false}>
      <UpdateMap position={position}/>
      <TileLayer
        attribution='
          &copy;
          <a href="http://osm.org/copyright">OpenStreetMap</a>
          contributors
        '
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker key="marker-1" position={position}>
        <Popup>
          <h5>{station.common_name}駅</h5>
       </Popup>
      </Marker>
    </MapContainer>
  )
}

function UpdateMap({position}) {
  const map = useMap();
  map.panTo(position);
  return null;
}

export default SearchByPrefecture;
