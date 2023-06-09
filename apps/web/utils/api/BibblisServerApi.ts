import axios from 'axios';

import isProd from '../isProd';

const BibblisServerApi = (() => {
  const baseHost = isProd && 'https://bibblis.com' || 'http://localhost:3000';

  const baseUrl = `${baseHost}/api`;
  const axiosInstance = axios.create();

  // TODO add always acces_token to the request and retry the request refreshing
  // the token

  return {
    getPageBookData: async (bookId: string) => {
      try {
        const res = await axiosInstance.get(`${baseUrl}/book/page-data/${bookId}`);
        return res.data;
      } catch (error) {
        return false;
      }
    },
    getAuthorPageData: async (authorId: string) => {
      try {
        const res = await axiosInstance.get(`${baseUrl}/author/page-data/${authorId}`);
        return res.data;
      } catch (error) {
        return false;
      }
    },
    getLatestBooks: async () => {
      try {
        const res = await axiosInstance.get(`${baseUrl}/book/latest`);
        return res.data;
      } catch (error) {
        return false;
      }
    },
  };
})();

export default BibblisServerApi;
