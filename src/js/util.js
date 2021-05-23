import axios from 'axios';

const fetchData = async (url, params = {}) => {
  const response = await axios.get(url, {
    params,
  });

  if (response.data.Error) {
    return [];
  }

  return response.data.Search;
};

const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export { fetchData, debounce };
