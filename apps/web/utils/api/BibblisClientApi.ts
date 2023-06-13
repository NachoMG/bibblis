import axios, { AxiosRequestHeaders } from 'axios';

import { ISignInData } from '../../types/i-sign-in-data';
import { ISignInResData } from '../../types/i-sign-in-res-data';
import { ISignUpData } from '../../types/i-sign-up-data';
import { IForgotPasswordData } from '../../types/i-forgot-password-data';
import { IResetPasswordData } from '../../types/i-reset-password-data';

import isProd from '../isProd';
import AccessToken from '../AccessToken';

const BibblisClientApi = (() => {
  const baseHost = isProd && 'https://bibblis.com' || 'http://localhost:3000';

  const baseUrl = `${baseHost}/api`;
  axios.defaults.withCredentials = true
  const axiosInstance = axios.create();

  // access token is added to all requests if exists.
  axiosInstance.interceptors.request.use(async (config) => {
    const accessToken = AccessToken.get();
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`
      } as AxiosRequestHeaders;
    }
    return config;
  });

  // If response have an error code 401 Unauthorized and the access token
  // exists, it tries to refresh the token and resend the original request.
  axiosInstance.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const originalRequest = error.config;
      const accessToken = AccessToken.get();
      if (
        error.response.status === 401 && accessToken && !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const res = await axios.post(`${baseUrl}/auth/refresh`);
          const access_token = res.data.access_token;
          AccessToken.set(access_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        } catch (e) {
          return Promise.reject(error);
        }
        return axios(originalRequest);
      }
      return Promise.reject(error);
    }
  );

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
        const response = await axiosInstance.post(`${baseUrl}/auth/sign-up`, signUpData);
        AccessToken.set(response.data.access_token);
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
    checkResetPasswordToken: async (resetPasswordToken: string) => {
      try {
        await axiosInstance.post(`${baseUrl}/auth/check-reset-password-token`, false, {
          headers: {
            'Authorization': `Bearer ${resetPasswordToken}`,
          },
        });
        return true;
      } catch (error) {
        return false;
      }
    },
    resetPassword: async (resetPasswordToken: string, resetPasswordData: IResetPasswordData) => {
      try {
        await axiosInstance.post(`${baseUrl}/auth/reset-password`, resetPasswordData, {
          headers: {
            'Authorization': `Bearer ${resetPasswordToken}`,
          },
        });
        return true;
      } catch (error) {
        return false;
      }
    },
    signOut: async () => {
      try {
        await axiosInstance.post(`${baseUrl}/auth/sign-out`);
        return true;
      } catch (error) {
        return false;
      }
    },
    getUserBooks: async () => {
      try {
        const res = await axiosInstance.get(`${baseUrl}/user/me/book`);
        return res.data;
      } catch (error) {
        return [];
      }
    },
    getUserBook: async (bookId: string) => {
      try {
        const res = await axiosInstance.get(`${baseUrl}/user/me/book/${bookId}`);
        return res.data;
      } catch (error) {
        return false;
      }
    },
    addUserBook: async (bookId: string) => {
      try {
        const res = await axiosInstance.post(`${baseUrl}/user/me/book`, { bookId });
        return res.data;
      } catch (error) {
        return false;
      }
    },
    removeUserBook: async (bookId: string) => {
      try {
        const res = await axiosInstance.delete(`${baseUrl}/user/me/book/${bookId}`);
        return res.data;
      } catch (error) {
        return false;
      }
    },
  };
})();

export default BibblisClientApi;
