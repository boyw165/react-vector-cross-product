import $ from 'jquery';
import React from 'react';
import App from './views/App';

$(function() {
  React.render(
    <App/>,
    document.getElementById('app')
  );
});
