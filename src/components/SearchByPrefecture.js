import React, {Component} from 'react'

import Button from 'react-bootstrap/Button';
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
            />
          </div>
        </div>
      </>
    );
  }
};

function SearchForm({prefectures, lines, stations}) {
  return (
    <Form>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Control as="select" defaultValue="都道府県を選択">
            <option value="">都道府県を選択</option>
            <OptionPrefectures prefectures={prefectures}/>
         </Form.Control>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Control
            as="select"
            defaultValue="路線を選択"
            disabled={!lines.formEnabled}
          >
            <option key='prefecture-0' value="">路線を選択</option>
         </Form.Control>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Control
            as="select"
            defaultValue="駅を選択"
            disabled={!stations.formEnabled}
          >
            <option value="">駅を選択</option>
         </Form.Control>
        </Form.Group>
      </Form.Row>
      <Button variant="primary" type="submit">検索</Button>
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

export default SearchByPrefecture;
