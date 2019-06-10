import React, { useEffect, useState } from 'react';
import ReactStars from 'react-stars';
import isEmpty from 'lodash.isempty';
import axios from 'axios';

import { Restaurant } from '../hooks/useFilter';
import '../styles/layout';
import '../styles/heading';
import '../styles/single-listing';

export const SingleListing = (props: any) => {
  const { id: restaurantId } = props;
  const [restaurant, setRestaurant] = useState({} as Restaurant);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchListingDetails(restaurantId);
  }, [restaurantId]);

  const fetchListingDetails = async (id: string): Promise<void> => {
    try {
      const listing = await axios.get(`http://localhost:5000/yelp/listing/${id}`);
      setRestaurant(listing.data);
      const collection = await axios.get(`http://localhost:5000/yelp/reviews/${id}`);
      setReviews(collection.data.reviews);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      {!isEmpty(restaurant) && (
        <div className="content-container">
          <h1 id="single-listing-header">{restaurant.name}</h1>
          <div id="meta">{restaurant.categories[0].title} • {restaurant.price}</div>
          <ReactStars
            count={5}
            value={restaurant.rating}
            size={24}
            edit={false}
            half
            color1={'#e2e2e2'}
            color2={'#002B56'}
          />
          <div id="review-count">{restaurant.review_count} Reviews</div>
          {reviews.length > 0 && reviews.map(review => (
            <div className="review-card-container" key={review.id}>
              <div className="reviewer-image">
                <img className="user-thumbnail" src={review.user.image_url} />
              </div>
              <div className="reviewer-profile">
                <div>{review.user.name}</div>
                <div>{review.time_created.substring(0, 10)}</div>
              </div>
              <div className="review-content">
                <ReactStars
                  count={5}
                  value={review.rating}
                  size={24}
                  edit={false}
                  half
                  color1={'#e2e2e2'}
                  color2={'#002B56'}
                />
                <p>{review.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
};