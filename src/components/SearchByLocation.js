import React, {Component} from 'react';

import {Form, Col, Button} from 'react-bootstrap';

class SearchByLocation extends Component {
  render() {
    return (
      <>
        <p>緯度と経度を入力し最寄り駅を検索</p>
        <Form>
          <Form.Row>
            <Form.Group as={Col} controlId="latitude">
              <Form.Label>緯度</Form.Label>
              <Form.Control placeholder="35.655164046"/>
            </Form.Group>

            <Form.Group as={Col} controlId="longitude">
              <Form.Label>経度</Form.Label>
              <Form.Control placeholder="139.740663704"/>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>距離</Form.Label>
              <Form.Control as="select" defaultValue="1km以内">
                <option>1km以内</option>
                <option>5km以内</option>
                <option>10km以内</option>
                <option>20km以内</option>
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