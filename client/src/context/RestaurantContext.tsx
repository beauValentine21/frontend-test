import React, { createContext } from 'react';
import { useFilter, FilterState } from '../hooks/useFilter';

type RestaurantStoreContext = {
  filterState: FilterState,
  filterDispatch: Function
}

const RestaurantContext = createContext({} as RestaurantStoreContext);

const RestaurantProvider = ({ children }: any) => {
  const { filterState, filterDispatch } = useFilter();

  const localContext: RestaurantStoreContext = {
    filterState,
    filterDispatch
  };

  return (
    <RestaurantContext.Provider value={localContext}>
      {children}
    </RestaurantContext.Provider>
  );
};

export { RestaurantContext, RestaurantProvider };
