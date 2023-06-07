import axios from 'axios';

import { ISignInData } from '../../types/i-sign-in-data';
import { ISignInResData } from '../../types/i-sign-in-res-data';
import { ISignUpData } from '../../types/i-sign-up-data';
import { IForgotPasswordData } from '../../types/i-forgot-password-data';

import isProd from '../isProd';
import AccessToken from '../AccessToken';

const BibblisClientApi = (() => {
  const baseHost = isProd && 'https://bibblis.com' || 'http://localhost:3000';

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
    signUp: async (signUpData: ISignUpData) => {
      try {
        await axiosInstance.post(`${baseUrl}/auth/sign-up`, signUpData);
        return { error: false, status: 200 };
      } catch (error) {
        return {
          error: true,
          status: axios.isAxiosError(error) && error.response?.status || 0,
        }
      }
    },
    confirmEmail: async (confirmEmailToken: string) => {
      try {
        await axiosInstance.post(`${baseUrl}/auth/verify-email`, false, {
          headers: {
            'Authorization': `Bearer ${confirmEmailToken}`,
          },
        });
      } catch (error) {
        return false;
      }
      return true;
    },
    signIn: async (signInData: ISignInData) => {
      try {
        const response = await axiosInstance.post<ISignInResData>(`${baseUrl}/auth/sign-in`, signInData);
        AccessToken.set(response.data.access_token);
        return true;
      } catch (error) {
        return false;
      }
    },
    forgotPassword: async (forgotPassworData: IForgotPasswordData) => {
      try {
        await axiosInstance.post<IForgotPasswordData>(`${baseUrl}/auth/forgot-password`, forgotPassworData);
        return true;
      } catch (error) {
        return false;
      }
    },
  };
})();

export default BibblisClientApi;
