import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchPage from './pages/SearchPage';
import FilterPage from './pages/FilterPage';
import MovieDetail from './pages/MovieDetail';
import Schedules from './components/Schedules';
import ProfilePage from './pages/ProfilePage';

// PrivateRoute is a wrapper component that protects routes from unauthorized access, you have to be logged in to access the profile page   
const PrivateRoute = ({ children }) => {
    // Check if user is authenticated by looking for token
    const token = localStorage.getItem('token');
    
    // If authenticated, render the protected component
    // If not, redirect to login page
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<Schedules />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/filter" element={<FilterPage />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        </Routes>
    );
}

export default App;