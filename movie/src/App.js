import React from 'react';

import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchPage from './pages/SearchPage';
import FilterPage from './pages/FilterPage';
import MovieDetail from './pages/MovieDetail';
import Schedules from './components/Schedules';

const App = () => {
    return (
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Schedules />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/filter" element={<FilterPage />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </div>
    );
};



export default App;
