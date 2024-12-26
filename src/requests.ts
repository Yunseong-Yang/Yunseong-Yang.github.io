const API_KEY = 'b2fe57ddb2df376d8122bd8a24ee6e9a';

const requests = {
  fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=ko`,
  fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=ko`,
  fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28&language=ko`,
  fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749&language=ko`,
};

export default requests;
