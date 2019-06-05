import React from 'react';
import { render } from 'react-dom';
import { Router } from "@reach/router"
import { Home } from './pages/Home';
import { Review } from './pages/Review';
import './styles';

render(
  <Router>
    <Home path="/" />
    <Review path="review" />
  </Router>
  , document.querySelector('.root'));