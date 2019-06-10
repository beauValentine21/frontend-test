import { useEffect, useReducer, useCallback } from 'react';
import axios from 'axios';
import isEmpty from 'lodash.isempty';

// todo lift this hook into context so that it maintains state across page navigation
type RestaurantCategory = {
  alias: string;
  title: string;
}

export type Restaurant = {
  id: string;
  name: string;
  image_url: string;
  is_closed: boolean;
  url: string;
  review_count: number;
  categories: Array<RestaurantCategory>;
  rating: number;
  coorinates: {
    latitude: string;
    longitude: string;
  };
  transactions?: Array<string>;
  price: string;
  location: {
    address1: string;
    address2?: string;
    address3?: string;
    city: string;
    zip_code: string;
    country: string;
    state: string;
    display_address: Array<string>;
  };
  phone?: string;
  display_phone?: string;
  distance: number;
}

export type FilterState = {
  categories: Array<RestaurantCategory>;
  restaurants: Array<Restaurant>;
  isLoadingRestaurants: boolean;
  shouldShowOpenOnly: boolean;
  category: string;
  price: string;
}

interface FilterAction {
  type: string;
  payload?: any;
}

const initialState: FilterState = {
  isLoadingRestaurants: false,
  shouldShowOpenOnly: false,
  restaurants: [],
  categories: [],
  category: '',
  price: ''
};

const filterReducer = (
  state: FilterState,
  action: FilterAction
): FilterState => {
  switch (action.type) {
    case 'UPDATE_IS_LOADING_RESTAURANTS':
      return { ...state, isLoadingRestaurants: action.payload };
    case 'UPDATE_SHOULD_SHOW_OPEN_ONLY':
      return { ...state, shouldShowOpenOnly: action.payload };
    case 'UPDATE_SELECTED_CATEGORY':
      return { ...state, category: action.payload };
    case 'UPDATE_SELECTED_PRICE':
      return { ...state, price: action.payload };
    case 'UPDATE_RESTAURANTS':
      return { ...state, restaurants: action.payload };
    case 'UPDATE_CATEGORIES':
      return { ...state, categories: action.payload };
    default:
      return state;
  }
};

export const useFilter = () => {
  const [filterState, filterDispatch] = useReducer(filterReducer, initialState);

  // effect for fetching restaurants and categories on mount
  useEffect(() => {
    fetchCategories();
    let restaurantCollection;

    filterDispatch({
      type: 'UPDATE_IS_LOADING_RESTAURANTS',
      payload: true
    });

    fetchRestaurants(filterState.category)
      .then(results => {
        restaurantCollection = results;

        filterDispatch({
          type: 'UPDATE_RESTAURANTS',
          payload: restaurantCollection
        });
        filterDispatch({
          type: 'UPDATE_IS_LOADING_RESTAURANTS',
          payload: false
        });
      });
  }, []);

  useEffect(() => {
    if (!isEmpty(filterState.price)) {
      filterDispatch({
        type: 'UPDATE_RESTAURANTS',
        payload: filterByPrice(filterState.price)
      });
    }
  }, [filterState.price]);

  useEffect(() => {
    if (filterState.shouldShowOpenOnly) {
      filterDispatch({
        type: 'UPDATE_RESTAURANTS',
        payload: filterIfOpen()
      });
    }
  }, [filterState.shouldShowOpenOnly]);

  // effect to refetch restaurants filtered by selected category, server side
  useEffect(() => {
    filterDispatch({
      type: 'UPDATE_IS_LOADING_RESTAURANTS',
      payload: true
    });
    fetchRestaurants(filterState.category)
      .then(results => {
        filterDispatch({
          type: 'UPDATE_RESTAURANTS',
          payload: results
        });
        filterDispatch({
          type: 'UPDATE_IS_LOADING_RESTAURANTS',
          payload: false
        });
      });
  }, [filterState.category])

  const fetchRestaurants = async (category: string): Promise<Restaurant[]> => {
    const categoryType: string = isEmpty(category) ? 'restaurants' : category;
    try {
      const { data } = await axios.get(`http://localhost:5000/yelp/${categoryType}`);
      return data.businesses;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async (): Promise<void> => {
    try {
      const { data } = await axios.get('http://localhost:5000/categories');
      filterDispatch({
        type: 'UPDATE_CATEGORIES',
        payload: data
      });
    } catch (error) {
      console.error(error);
    }
  };

  const filterByPrice = (price: string): Restaurant[] => {
    // if none or all is selected, don't bother filtering
    if (price === 'all' || isEmpty(price)) return filterState.restaurants;

    const matchesPrice = (restaurant: Restaurant) => restaurant.price === price;
    // only return restaurants that match the provided price;
    return filterState.restaurants.filter(matchesPrice);
  };

  const filterIfOpen = (): Restaurant[] => {
    const isOpen = (restaurant: Restaurant) => !restaurant.is_closed;
    // only return restaurants that are open
    return filterState.restaurants.filter(isOpen);
  }

  return { filterState, filterDispatch };
};
