import React from 'react';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {IndexLinkContainer, LinkContainer} from 'react-router-bootstrap';

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <IndexLinkContainer to='/'>
          <Nav.Link>ホーム</Nav.Link>
        </IndexLinkContainer>
        <LinkContainer to='/search-by-location'>
          <Nav.Link>最寄り駅</Nav.Link>
        </LinkContainer>
        <LinkContainer to='/search-by-prefecture'>
          <Nav.Link>都道府県で探す</Nav.Link>
        </LinkContainer>
      </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;