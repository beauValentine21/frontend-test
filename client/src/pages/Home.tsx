import React from 'react';
import { RestaurantProvider } from '../context/RestaurantContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { FilterBar } from '../components/FilterBar';
import { Gallery } from '../components/Gallery';
import '../styles/home';

export const Home = (props: any) => {

  const headingText = `
    Lorem ipsum dolor sit amet, consectetur
    adipiscing elit, sed do eiusmod tempor
    incididunt ut labore et dolore magna aliqua.
  `;

  return (
    <div className="home-container">
      <h1>Restaurants</h1>
      <div className="heading-description">{headingText}</div>
      <RestaurantProvider>
        <ErrorBoundary componentName="FilterBar">
          <FilterBar />
        </ErrorBoundary>
        <ErrorBoundary componentName="Gallery">
          <Gallery />
        </ErrorBoundary>
      </RestaurantProvider>
    </div>
  )
};