import { PropsWithChildren } from 'react';

import Head from 'next/head';

import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
      </Head>
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <main className="container bg-white py-5 px-5 my-auto">
          { children }
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
