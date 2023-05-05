import Image from 'next/image';
import Link from 'next/link';

import IsbnSearchBox from './IsbnSearchBox';

const Header = () => {
  return (
    <header className="row bg-primary px-2 px-md-5 py-2 align-items-center">
      <div className="col">
        <Image src={'/bibblis-logo.svg'} alt="logo" height={50} width={100} />
      </div>
      <div className="col-7 col-md-4 col-lg-3">
        <IsbnSearchBox />
      </div>
      <div className="d-none d-md-block col-auto px-0">
        <Link href="sign-in" className="btn btn-secondary">
          Iniciar sesión
        </Link>
      </div>
      <div className="d-none d-md-block col-auto">
        <a className="btn btn-tertiary">
          Registrarse
        </a>
      </div>
    </header>
  );
};

export default Header;