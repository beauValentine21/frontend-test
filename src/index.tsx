import React from 'react';
import { render } from 'react-dom';
import { Router } from "@reach/router"
import { Home } from './components/Home';
import { Review } from './components/Review';
import './styles';

render(
  <Router>
    <Home path="/" />
    <Review path="review" />
  </Router>
  , document.querySelector('.root'));