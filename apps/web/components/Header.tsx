import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import AccessToken from '../utils/AccessToken';
import BibblisClientApi from '../utils/api/BibblisClientApi';
import IsbnSearchBox from './IsbnSearchBox';

const Header = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    setIsUserLoggedIn(!!AccessToken.get());
  }, []);

  const signOut = async () => {
    await BibblisClientApi.signOut();
    AccessToken.set('');
    location.reload();
  };

  return (
    <header className="bg-primary px-2 px-md-5 py-2">
      <div className="row align-items-center">
        <div className="col">
          <Link href="/">
            <Image src={'/bibblis-logo.svg'} alt="logo" height={50} width={100} />
          </Link>
        </div>
        <div className="col-7 col-md-4 col-lg-3">
          <IsbnSearchBox />
        </div>
        {isUserLoggedIn &&
          <>
            <div className="d-none d-md-block col-auto px-0">
              <Link href="/my-library" className="btn btn-secondary">
                Mi biblioteca
              </Link>
            </div>
            <div className="d-none d-md-block col-auto">
              <a onClick={signOut} className="btn btn-tertiary">
                Cerrar sesión
              </a>
            </div>
          </>
        ||
          <>
            <div className="d-none d-md-block col-auto px-0">
              <Link href="/sign-in" className="btn btn-secondary">
                Iniciar sesión
              </Link>
            </div>
            <div className="d-none d-md-block col-auto">
              <Link href="/sign-up" className="btn btn-tertiary">
                Registrarse
              </Link>
            </div>
          </>
        }
      </div>
      <div className="row d-md-none mt-2">
        {isUserLoggedIn &&
          <>
            <div className="col-6">
              <Link href="/my-library" className="btn btn-secondary w-100">
                Mi biblioteca
              </Link>
            </div>
            <div className="col-6">
              <a onClick={signOut} className="btn btn-tertiary w-100">
                Cerrar sesión
              </a>
            </div>
          </>
        ||
          <>
            <div className="col-6">
              <Link href="/sign-in" className="btn btn-secondary w-100">
                Iniciar sesión
              </Link>
            </div>
            <div className="col-6">
              <Link href="/sign-up" className="btn btn-tertiary w-100">
                Registrarse
              </Link>
            </div>
          </>
        }
      </div>
    </header>
  );
};

export default Header;
