import { useEffect, useReducer } from 'react';
import axios from 'axios';

type RestaurantCategory = {
  alias: string;
  title: string;
}

type Restaurant = {
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

type FilterBarState = {
  categories: Array<RestaurantCategory>;
  restaurants: Array<Restaurant>;
  shouldShowOpenOnly: boolean;
  category: string;
  price: string;
}

interface FilterBarAction {
  type: string;
  payload?: any;
}

const initialState: FilterBarState = {
  shouldShowOpenOnly: false,
  restaurants: [],
  categories: [],
  category: '',
  price: ''
};

const filterBarReducer = (
  state: FilterBarState,
  action: FilterBarAction
): FilterBarState => {
  switch (action.type) {
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
  const [filterState, filterDispatch] = useReducer(filterBarReducer, initialState);

  // TODO implement effect for fetching restaurants and categories on mount
  useEffect(() => {
    fetchRestaurants();
    fetchCategories();
    // fetch restaurants
    // fetch categories
  }, []);

  // TODO implement effect for client side filtering restraunts when price or shouldShowOpenOnly change
  useEffect(() => {
    // fetch restaurants
  }, [filterState.price, filterState.shouldShowOpenOnly]);

  // TODO implement effect for server side filtering restraunts when category change
  useEffect(() => {
    // fetch restaurants
  }, [filterState.category]);

  const fetchRestaurants = async (): Promise<void> => {
    try {
      const { data } = await axios.get('http://localhost:5000/restaurants');
      filterDispatch({
        type: 'UPDATE_RESTAURANTS',
        payload: data.businesses
      });
      // console.log(`restaurants -> ${JSON.stringify(data.businesses, null, 2)}`);
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
      // console.log(`categories length -> ${JSON.stringify(data.length, null, 2)}`);
      // console.log(`categories -> ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error(error);
    }
  };

  return { filterState, filterDispatch };
}