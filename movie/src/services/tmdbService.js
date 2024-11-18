const TMDB_API_KEY = '37182f785fefbf36bf0cc584da8b338a';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const searchMovie = async (title) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=en-US`
    );
    const data = await response.json();
    return data.results[0]; // Return the first (most relevant) result
  } catch (error) {
    console.error('Error fetching movie data:', error);
    return null;
  }
};

export const getImageUrl = (posterPath) => {
  if (!posterPath) return null;
  return `${IMAGE_BASE_URL}${posterPath}`;
}; 