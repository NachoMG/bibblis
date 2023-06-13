import { useEffect, useState } from 'react';

import { GetServerSidePropsContext } from 'next';

import Head from 'next/head';

import { Book } from '@prisma/client';

import Loader from '../components/Loader';
import MainLayout from '../layouts/MainLayout';
import Mosaic from '../components/Mosaic';
import BibblisClientApi from '../utils/api/BibblisClientApi';

const MyLibrary = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [mosaicItems, setMosaicItems] = useState([]);

  useEffect(() => {
    BibblisClientApi.getUserBooks().then((userBooks) => {
      const formattedBooks = (userBooks || []).map(({ book }: { book: Book }) => ({
        id: book.id,
        title: book.title,
        href: `/book/${book.id}`,
        src: book.cover || '/default-book.jpg',
      }));
      setMosaicItems(formattedBooks); 
      setIsLoading(false);
    });
  }, []);

  return (
    <MainLayout>
      <Head>
        <title>Mi bibliotecta | Bibblis</title>
        <meta
          name="description"
          content="Usa tu biblioteca para gestionar tus libros y disfrutar al máximo de Bibblis"
        />
      </Head>
      <div className="row">
        <div className="col">
          <h1>Mi biblioteca</h1>
        </div>
      </div>
      {isLoading &&
        <div className="row mt-3">
          <div className="col text-center">
            <Loader />
          </div>
        </div>
      || (
        <div className="row mt-3">
          <div className="col">

          {mosaicItems.length > 0 &&
            <Mosaic items={mosaicItems} />
          ||
            <>
              <p>
                ¡Vaya! Parece que todavía no has agregado ningún libro a tu
                biblioteca.
              </p>
              <p>
                Busca tu libro ideal haciendo uso del buscador, agrégalo a tu
                biblioteca y ¡empieza a disfrutar de Bibblis!
              </p>
            </>
          }
          </div>
        </div>
      )
      
      }
    </MainLayout>
  );
};

export default MyLibrary;

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  if (!context.req.headers.cookie?.startsWith('refresh')) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    }
  }
  return {
    props: { },
  };
};
