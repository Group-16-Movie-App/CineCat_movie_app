import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchPage from './pages/SearchPage';
import FilterPage from './pages/FilterPage';
import MovieDetail from './pages/MovieDetail';
import Schedules from './components/Schedules';
import ProfilePage from './pages/ProfilePage';
import FavoritesList from './components/FavoritesList';
import Footer from './components/Footer';
import ReviewsPage from './pages/ReviewsPage';
import TrendingMovies from './components/TrendingMovies';
import SharedFavorites from './components/SharedFavorites';
import EmailVerificationSuccess from './pages/EmailVerificationSuccess';


// PrivateRoute is a wrapper component that protects routes from unauthorized access, you have to be logged in to access the profile page   
const PrivateRoute = ({ children }) => {
    // Check if user is authenticated by looking for token
    const token = localStorage.getItem('token');
    
    // If authenticated, render the protected component
    // If not, redirect to login page
    return token ? children : <Navigate to="/login" />;
};

function App() {
    const [backgroundImage, setBackgroundImage] = useState('');

    useEffect(() => {
        console.log('Current background image:', backgroundImage);
    }, [backgroundImage]);

    return (
        <div className="App">
            {backgroundImage && (
                <div className="background-wrapper">
                    <div 
                        className="background-image" 
                        style={{ 
                            backgroundImage: `url("${backgroundImage}")`,
                            opacity: 1
                        }}
                    />
                </div>
            )}
            <div className="content-wrapper">
                <Navbar />
                <Routes>
                    <Route path="/" element={<>
                                                <TrendingMovies setBackgroundImage={setBackgroundImage}/>
                                                <ReviewsPage />
                                            </>} />
                    <Route path="/showtime" element={<Schedules />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/filter" element={<FilterPage />} />
                    <Route path="/movie/:id" element={<MovieDetail />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/verification-success" element={<EmailVerificationSuccess />} />
                    <Route path="/profile/:userId" element={<ProfilePage />} />
                    <Route path="/favorites" element={
                        <PrivateRoute>
                            <FavoritesList />
                        </PrivateRoute>
                    } />
                    <Route path="/favorites/:userId" element={<SharedFavorites />} />
                </Routes>
                <Footer />
            </div>
        </div>
    );
}

export default App;