import React, {Component} from 'react'

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

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
      }
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
      this.setState({
        stations: {
          data: [],
          formEnabled: false
        }
      });
    } else {

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

export default SearchByPrefecture;
