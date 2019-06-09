const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const app = express();

require("dotenv").config({ path: path.resolve("./.env") });


app.use(cors());

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/restaurants', async (req, res) => {
  // TODO implement filters for yelp
  try {
    const { data } = await axios({
      url: `https://api.yelp.com/v3/businesses/search?term=restaurants&location=las_vegas&$price=1,2&category=Noodles`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${process.env.YELP_TOKEN}`
      }
    });
    res.send(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get('/categories', async (req, res) => {
  // TODO implement filter to only send back results for restaurant
  try {
    const { data } = await axios({
      url: 'https://api.yelp.com/v3/categories?local=en_US',
      method: 'get',
      headers: {
        Authorization: `Bearer ${process.env.YELP_TOKEN}`
      }
    });
    res.send(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
