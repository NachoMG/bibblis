import axios from 'axios';
import isProd from '../isProd';

const BibblisClientApi = (() => {
  const baseHost = isProd && 'https://biblis.com' || 'http://localhost:3000';

  const baseUrl = `${baseHost}/api`;
  const axiosInstance = axios.create();

  // TODO add always acces_token to the request and retry the request refreshing
  // the token

  return {
    searchBook: async (bookId: string) => {
      try {
        const res = await axiosInstance.get(`${baseUrl}/book/search/${bookId}`);
        return res.data;
      } catch (error) {
        return false;
      }
    },
  };
})();

export default BibblisClientApi;
