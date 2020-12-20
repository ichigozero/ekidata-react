import React, {Component} from 'react'

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

class SearchByPrefecture extends Component {
  render() {
    return  (
      <>
        <div className="row">
          <p>都道府県で路線/駅を検索</p>
        </div>
        <div className="row">
          <div className="col px-0">
            <SearchForm/>
          </div>
        </div>
      </>
    );
  }
};

function SearchForm() {
  return (
    <Form>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Control as="select" defaultValue="都道府県を選択">
            <option value="">都道府県を選択</option>
         </Form.Control>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Control as="select" defaultValue="路線を選択">
            <option value="">路線を選択</option>
         </Form.Control>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Control as="select" defaultValue="駅を選択">
            <option value="">駅を選択</option>
         </Form.Control>
        </Form.Group>
      </Form.Row>
      <Button variant="primary" type="submit">検索</Button>
    </Form>
  )
}

export default SearchByPrefecture;
