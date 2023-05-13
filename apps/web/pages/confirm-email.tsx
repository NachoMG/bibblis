import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import BibblisClientApi from '../utils/api/BibblisClientApi';
import Link from 'next/link';
import Loader from '../components/Loader';
import MainLayout from '../layouts/MainLayout';

const ConfirmEmail = () => {
  const { query, isReady } = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isReady) {;
      if (!query.token) {
        setError(true);
        setIsLoading(false);
      } else {
        const token = (
          Array.isArray(query.token) ? query.token.join('') : query.token
        );
        BibblisClientApi
          .confirmEmail(token)
          .then((result) => {
            setError(!result);
            setIsLoading(false);
          });
      }
    }
  }, [query, isReady]);

  return (
    <MainLayout>
      <div className="row mb-5">
        <div className="col">
          <h1>Confirmar correo</h1>
        </div>
      </div>
      <div className="row">
        <div className="col text-center">
          {isLoading
            && (
              <Loader />
            )
            || (
              error && (
                <p>El enlace proporcionado no es válido.</p>
              )
              || (
                <>
                  <p>¡Email confirmado correctamente!</p>
                  <p>
                    <Link href="/sign-in" className="btn btn-primary w-50">
                      Iniciar sesión
                    </Link>
                  </p>
                </>
              )
            )
          }
        </div>
      </div>
    </MainLayout>
  );
};

export default ConfirmEmail;
