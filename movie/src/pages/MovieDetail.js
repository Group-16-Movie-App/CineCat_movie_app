import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Reviews from "../components/Reviews";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/movies/${id}`)
      .then((response) => setMovie(response.data))
      .catch((error) => console.error("Error fetching movie details:", error));
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <>
      <button onClick={() => navigate("/")}>Back to Home</button>
      <div style={{ width: "100%", textAlign: "center" }}>
        <div>
          <button onClick={() => navigate("/search")}>To Movies Search</button>
          <button onClick={() => navigate("/filter")}>
            To Movies Discovery
          </button>
        </div>
        <h2>{movie.title}</h2>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          style={{ maxWidth: "300px" }}
        />
        <p>{movie.overview}</p>
        <p>Genre: {movie.genres.map((genre) => genre.name).join(", ")}</p>
        <p>Rating: {movie.vote_average}</p>
        <p>Release Date: {movie.release_date}</p>

        <Reviews movieId={id} />
      </div>
    </>
  );
};

export default MovieDetail;
