import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import FilterPage from './pages/FilterPage';
import MovieDetail from './pages/MovieDetail';

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/search" element={<SearchPage />} />
                <Route path="/filter" element={<FilterPage />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
            </Routes>
        </div>
    );
};

export default App;
