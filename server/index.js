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
    res
      .status(error.status || 500)
      .json({ status: error.status, message: error.message });
  }
});

app.get('/categories', async (req, res) => {
  try {
    const { data } = await axios({
      url: 'https://api.yelp.com/v3/categories?local=en_US',
      method: 'get',
      headers: {
        Authorization: `Bearer ${process.env.YELP_TOKEN}`
      }
    });

    // predicate for finding only listings that have a parent_aliases which includes 'restaurants'
    const restaurantsOnly = element =>
      element.parent_aliases.some(type => type === 'restaurants');

    // filter collection with predicate above to only pass back results that belong to restaurants
    const filteredCategories = data.categories.filter(restaurantsOnly);

    // trim off excess info, only return alias and title per element
    const formattedResults = filteredCategories.map(({ alias, title }) => ({
      alias, title
    }));

    res.send(formattedResults);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ status: error.status, message: error.message });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
