const AccessToken = {
  set: (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
  },
  get: (): string => {
    return localStorage.getItem('accessToken') || '';
  },
};

export default AccessToken;
