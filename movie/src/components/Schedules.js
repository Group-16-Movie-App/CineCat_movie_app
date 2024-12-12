import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Schedules.css';
import { searchMovie, getImageUrl } from '../services/tmdbService';

const Schedules = () => {
  const [theatres, setTheatres] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [moviePosters, setMoviePosters] = useState({});

  const THEATRE_AREAS_URL = 'https://www.finnkino.fi/xml/TheatreAreas/';
  const SCHEDULE_URL = 'https://www.finnkino.fi/xml/Schedule/';

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(THEATRE_AREAS_URL);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      const theatreElements = xmlDoc.getElementsByTagName("TheatreArea");

      const theatreList = Array.from(theatreElements).map(theatre => ({
        id: theatre.getElementsByTagName("ID")[0].textContent,
        name: theatre.getElementsByTagName("Name")[0].textContent
      }));

      setTheatres(theatreList);
    } catch (err) {
      console.error('Error fetching theatres:', err);
      setError('Failed to fetch theatres. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async (theatreId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${SCHEDULE_URL}?area=${theatreId}`);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      const showElements = xmlDoc.getElementsByTagName("Show");

      const scheduleList = Array.from(showElements).map(show => {
        const schedule = {
          id: show.getElementsByTagName("EventID")[0]?.textContent,
          title: show.getElementsByTagName("Title")[0]?.textContent,
          theatre: show.getElementsByTagName("Theatre")[0]?.textContent,
          startTime: show.getElementsByTagName("dttmShowStart")[0]?.textContent,
          auditorium: show.getElementsByTagName("TheatreAuditorium")[0]?.textContent
        };
        return schedule;
      });

      const uniqueMovies = [...new Set(scheduleList.map(s => s.title))];
      const posterPromises = uniqueMovies.map(async (title) => {
        const movieData = await searchMovie(title);
        return {
          title,
          posterPath: movieData?.poster_path || null
        };
      });

      const posters = await Promise.all(posterPromises);
      const posterMap = posters.reduce((acc, curr) => {
        acc[curr.title] = getImageUrl(curr.posterPath);
        return acc;
      }, {});

      setMoviePosters(posterMap);
      setSchedules(scheduleList);
      setError(null);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Failed to fetch schedules. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTheatreSelect = (theatreId) => {
    setSelectedTheatre(theatreId);
    fetchSchedules(theatreId);
  };

  const handleScheduleClick = (schedule) => {
    const eventId = schedule.id;
    const movieTitle = schedule.title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    const movieUrl = `https://www.finnkino.fi/en/event/${eventId}/title/${movieTitle}`;
    window.open(movieUrl, '_blank');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="schedules-container">
      <h2 className="h2">Movie Schedules</h2>

      <div className="theatre-select-container">
        <label htmlFor="theatre-select" className="theatre-select-label">Choose a cinema:</label>
        <select 
          id="theatre-select"
          className="theatre-select"
          value={selectedTheatre || ''}
          onChange={(e) => handleTheatreSelect(e.target.value)}
        >
          <option value="">Select a theatre</option>
          {theatres.map(theatre => (
            <option key={theatre.id} value={theatre.id}>
              {theatre.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTheatre && schedules.length > 0 && (
        <div className="schedules-list">
          {schedules.map(schedule => (
            <div 
              key={schedule.id} 
              className="schedule-item"
              onClick={() => handleScheduleClick(schedule)}
              role="button"
              tabIndex={0}
            >
              <div className="movie-image-container">
                <img 
                  src={moviePosters[schedule.title] || `https://via.placeholder.com/300x450?text=${schedule.title}`}
                  alt={schedule.title}
                  className="movie-image"
                />
              </div>
              <div className="movie-info">
                <h3>{schedule.title}</h3>
                <p>{schedule.theatre} - {schedule.auditorium}</p>
                <p>{new Date(schedule.startTime).toLocaleTimeString('fi-FI', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedules;
