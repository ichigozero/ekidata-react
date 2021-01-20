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
      form: {
        prefectures: {
          data: [],
          value: '',
        },
        lines: {
          data: [],
          value: '',
          formEnabled: false,
        },
        stations: {
          data: [],
          value: '',
          formEnabled: false,
        },
      },
      map: {
        station: null,
        render: false,
      },
    }
  }

  handleChangeOnPrefectureDropdown = async(event) => {
    const value = event.target.value;
    const {form} = this.state;

    form.prefectures.value = value;

    if (value !== '') {
      const apiUri = `/ekidata/api/v1.0/prefectures/${value}/lines`;

      await fetch(apiUri)
        .then(response => response.json())
        .then((data) => {
          if ('lines' in data) {
            form.lines.data = data.lines;
            form.lines.formEnabled = true;
          }
        })
        .catch((error) => alert(error.message));
    }

    this.setState({form});
  }

  handleChangeOnLineDropdown = async(event) => {
    const value = event.target.value;
    const {form} = this.state;

    form.lines.value = value;

    if (value !== '') {
      const apiUri = `/ekidata/api/v1.0/lines/${value}/stations`;

      await fetch(apiUri)
        .then(response => response.json())
        .then((data) => {
          if ('stations' in data) {
            form.stations.data = data.stations;
            form.stations.formEnabled = true;
          }
        })
        .catch((error) => alert(error.message));
      }

    this.setState({form});
  }

  handleChangeOnStationDropdown = (event) => {
    const value = event.target.value;
    const {form, map} = this.state;

    form.stations.value = value;

    if (value !== '') {
      const index = event.target.selectedIndex;
      map.station = form.stations.data[index - 1];
      map.render = true;
    }

    this.setState({form, map});
  }

  componentDidMount() {
    fetch(prefectureApiUri)
      .then(response => response.json())
      .then((data) => {
        if ('prefectures' in data) {
          const {prefectures} = data;
          const {form} = this.state;
          form.prefectures.data = prefectures;

          this.setState({form})
        }
      })
      .catch((error) => alert(error.message));
  }

  render() {
    const {prefectures, lines, stations} = this.state.form;
    const {station, render} = this.state.map;
    const handleChange = {
      prefecture: this.handleChangeOnPrefectureDropdown,
      line: this.handleChangeOnLineDropdown,
      station: this.handleChangeOnStationDropdown,
    }

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
              handleChange={handleChange}
            />
          </div>
        </div>
        {render &&
        (
          <div className="row mt-4">
            <DisplayMap station={station} zoom={16}/>
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
            value={prefectures.value}
            onChange={handleChange.prefecture}
          >
            <option value="">都道府県を選択</option>
            <OptionPrefectures prefectures={prefectures.data}/>
         </Form.Control>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Control
            as="select"
            name='line'
            value={lines.value}
            disabled={!lines.formEnabled}
            onChange={handleChange.line}
          >
            <option key='prefecture-0' value="">路線を選択</option>
            <OptionLines lines={lines.data}/>
         </Form.Control>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Control
            as="select"
            name='station'
            value={stations.value}
            disabled={!stations.formEnabled}
            onChange={handleChange.station}
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
