import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import '../styles/filter-bar';

import { RestaurantContext } from '../context/RestaurantContext';

const useStyles = makeStyles({
  priceSelection: {
    marginLeft: '1.3em',
    minWidth: 80,
  },
  categorySelection: {
    marginLeft: '1.3em',
    minWidth: 120,
  },
});

export const FilterBar = () => {
  const classes = useStyles();
  const { filterState, filterDispatch } = useContext(RestaurantContext);

  // render category selection from server side fetch
  const renderCategories = () =>
    filterState.categories && filterState.categories.map(category => (
      <MenuItem key={category.alias} value={category.alias}>
        {category.title}
      </MenuItem>
    ));

  return (
    <div className="filter-bar-container">
      <div id="filter-title">Filter By:</div>
      <div>
        <IconButton onClick={() =>
          filterDispatch({
            type: 'UPDATE_SHOULD_SHOW_OPEN_ONLY',
            payload: !filterState.shouldShowOpenOnly
          })
        }>
          {filterState.shouldShowOpenOnly
            ?
            <Icon fontSize="small" color="primary">radio_button_checked</Icon>
            :
            <Icon fontSize="small" color="primary">radio_button_unchecked</Icon>
          }
        </IconButton>
        <span id="open-now-text">Open Now</span>
      </div>
      <FormControl className={classes.priceSelection}>
        <InputLabel htmlFor="price-filter">Price</InputLabel>
        <Select
          value={filterState.price}
          onChange={
            e =>
              filterDispatch({ type: 'UPDATE_SELECTED_PRICE', payload: e.target.value })
          }
          inputProps={{
            name: 'price',
            id: 'price-filter',
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="$">$</MenuItem>
          <MenuItem value="$$">$$</MenuItem>
          <MenuItem value="$$$">$$$</MenuItem>
          <MenuItem value="$$$$">$$$$</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.categorySelection}>
        <InputLabel htmlFor="category-filter">Categories</InputLabel>
        <Select
          value={filterState.category}
          onChange={
            e =>
              filterDispatch({ type: 'UPDATE_SELECTED_CATEGORY', payload: e.target.value })
          }
          inputProps={{
            name: 'category',
            id: 'category-filter',
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {renderCategories()}
        </Select>
      </FormControl>
      {filterState.isLoadingRestaurants &&
        <CircularProgress style={{ marginLeft: '1em' }} color="secondary" />
      }
    </div>
  );
};
