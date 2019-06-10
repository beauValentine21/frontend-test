import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import ReactStars from 'react-stars';
import take from 'lodash.take';

import { RestaurantContext } from '../context/RestaurantContext';
import '../styles/gallery';

export const Gallery = () => {
  const [restaurantsVisibleCount, setRestaurantsVisibleCount] = useState(8);
  const { filterState, filterDispatch } = useContext(RestaurantContext);
  // todo import classNames and check is_closed

  const trimTitle = (value: string, limit: number): string =>
    value.length > limit ? `${value.substring(0, limit - 3)}...` : value;

  return (
    <>
      <h2>All Restaurants</h2>
      {(!filterState.isLoadingRestaurants && filterState.restaurants.length < 1) && (
        <div>no matches found.</div>
      )}
      <div className="grid-container">
        {filterState.restaurants.length > 0 && take(filterState.restaurants, restaurantsVisibleCount).map(
          (restaurant) => (
            <div key={restaurant.id} className="restaurant-preview-card">
              <img className="img-thumbnail" src={restaurant.image_url} alt="image" />
              <div className="restaurant-title">{trimTitle(restaurant.name, 27)}</div>
              <ReactStars
                count={5}
                value={restaurant.rating}
                size={24}
                edit={false}
                half
                color1={'#e2e2e2'}
                color2={'#002B56'}
              />
              <div className="meta-row">
                <div>{trimTitle(restaurant.categories[0].title, 8)} - {restaurant.price}</div>
                <div className="bullet-status-open">OPEN NOW</div>
              </div>
              <Button variant="contained" color="primary" className="learn-more-btn">
                Learn More
              </Button>
            </div>
          )
        )}
      </div>
      {!filterState.isLoadingRestaurants && (
        <div className="bottom-btn-container">
          <Button
            variant="outlined"
            color="primary"
            className="load-more-btn"
            onClick={() => setRestaurantsVisibleCount(restaurantsVisibleCount + 8)}
          >
            Load More
        </Button>
        </div>
      )}
    </>
  )
}