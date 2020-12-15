import React, {Component} from 'react';

import {Form, Col, Button} from 'react-bootstrap';

class SearchByLocation extends Component {
  state = {
    latitude: 35.655164046,
    longitude: 139.740663704,
    distance: 1,
  };

  handleChange = (event) => {
    const name = event.target.name;
    const value = parseInt(event.target.value);

    this.setState({
      [name]: value,
    });
  }

  handleSubmit() {
    return;
  }

  render() {
    return (
      <>
        <p>緯度と経度を入力し最寄り駅を検索</p>
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
                <option value="1">1km以内</option>
                <option value="5">5km以内</option>
                <option value="10">10km以内</option>
                <option value="20">20km以内</option>
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Button variant="primary" type="submit">検索</Button>
        </Form>
      </>
    );
  }
}

export default SearchByLocation;