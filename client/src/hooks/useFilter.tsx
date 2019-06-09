import { useEffect, useReducer } from 'react';
import axios from 'axios';

// todo lift this hook into context so that it maintains state across page navigation
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

type FilterState = {
  categories: Array<RestaurantCategory>;
  restaurants: Array<Restaurant>;
  shouldShowOpenOnly: boolean;
  category: string;
  price: string;
}

interface FilterAction {
  type: string;
  payload?: any;
}

const initialState: FilterState = {
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

  // TODO implement effect for fetching restaurants and categories on mount
  useEffect(() => {
    fetchRestaurants();
    fetchCategories();
    // fetch restaurants
  }, []);

  // TODO implement effect for client side filtering restraunts when price, shouldShowOpenOnly, category change
  useEffect(() => {
    // fetch restaurants
  }, [filterState.price, filterState.shouldShowOpenOnly, filterState.category]);

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
      console.log(`categories length -> ${JSON.stringify(data.length, null, 2)}`);
      // console.log(`categories -> ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error(error);
    }
  };

  const filterByPrice = (price: string, restaurants: Restaurant[]): Restaurant[] => {
    const matchesPrice = (restaurant: Restaurant) => restaurant.price === price;
    // only return restaurants that match the provided price;
    return restaurants.filter(matchesPrice);
  };

  const filterIfOpen = (restaurants: Restaurant[]): Restaurant[] => {
    const isOpen = (restaurant: Restaurant) => !restaurant.is_closed;
    // only return restaurants that are open
    return restaurants.filter(isOpen);
  }

  return { filterState, filterDispatch };
};
