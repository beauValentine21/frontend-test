import React from 'react';
import { render } from 'react-dom';
import { Router } from "@reach/router"

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { SingleListing } from './pages/SingleListing';
import { Home } from './pages/Home';
import './styles';

const customTheme = createMuiTheme({
  palette: {
    primary: {
      light: '#004589',
      main: '#002B56',
    },
    secondary: {
      light: '#0070df',
      main: '#0066cc',
    },
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // error: will use the default color
  }
});

render(
  <MuiThemeProvider theme={customTheme}>
    <Router>
      <Home path="/" />
      <SingleListing path="listing/:id" />
    </Router>
  </MuiThemeProvider>
  , document.querySelector('.root'));