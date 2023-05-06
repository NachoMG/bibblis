import { PropsWithChildren } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <main className="container bg-white py-5 px-5">
        { children }
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;