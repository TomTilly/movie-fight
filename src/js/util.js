import axios from 'axios';

const fetchData = async (url, params = {}) => {
  const response = await axios.get(url, {
    params,
  });
  return response;
};

export { fetchData };
