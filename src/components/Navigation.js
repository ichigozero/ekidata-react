import React from 'react';

import {NavLink} from 'react-router-dom';

const Navigation = () => {
  return (
    <div>
      <NavLink to='/'>ホーム</NavLink>
      <NavLink to='/search-by-location'>最寄り駅</NavLink>
      <NavLink to='/search-by-prefecture'>都道府県で探す</NavLink>
    </div>
  );
}

export default Navigation;