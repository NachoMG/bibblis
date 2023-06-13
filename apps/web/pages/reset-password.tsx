import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import Head from 'next/head';

import BibblisClientApi from '../utils/api/BibblisClientApi';
import Loader from '../components/Loader';
import MainLayout from '../layouts/MainLayout';
import ResetPasswordForm from '../components/ResetPasswordForm';

const ResetPassword = () => {
  const { query, isReady } = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isReady) {;
      if (!query.token) {
        setError(true);
        setIsLoading(false);
      } else {
        const queryToken = (
          Array.isArray(query.token) ? query.token.join('') : query.token
        );
        setToken(queryToken);
        BibblisClientApi
          .checkResetPasswordToken(queryToken)
          .then((result) => {
            setError(!result);
            setIsLoading(false);
          });
      }
    }
  }, [query, isReady]);

  return (
    <MainLayout>
      <Head>
        <title>Modificar contraseña | Bibblis</title>
      </Head>
      <div className="row mb-5">
        <div className="col">
          <h1>Modificar contraseña</h1>
        </div>
      </div>
      {isLoading
        && (
          <div className="row">
            <div className="col text-center">
              <Loader />
            </div>
          </div>
        )
        || (
          error && (
            <div className="row">
              <div className="col text-center">
                <p>El enlace proporcionado no es válido.</p>
              </div>
            </div>
          )
          || (
            <ResetPasswordForm token={token} />
          )
        )
      }
    </MainLayout>
  );
};

export default ResetPassword;
