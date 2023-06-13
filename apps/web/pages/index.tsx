import Head from 'next/head';

import { Book } from '@prisma/client';

import MainLayout from '../layouts/MainLayout';
import BibblisServerApi from '../utils/api/BibblisServerApi';
import Mosaic from '../components/Mosaic';

interface IndexPageProps {
  latestBooks: Book[],
}

const Index = ({ latestBooks }: IndexPageProps) => {
  const mosaicItems = (latestBooks || []).map((book) => ({
    id: book.id,
    title: book.title,
    href: `/book/${book.id}`,
    src: book.cover || '/default-book.jpg',
  }));

  return (
    <MainLayout>
      <Head>
        <title>¡Bienvenido! | Bibblis</title>
        <meta
          name="description"
          content="Regístrate y empieza a gestionar tu librería"
        />
      </Head>
      <div className="row">
        <div className="col">
          <h1>
            ¡Bienvenido a bibblis!
          </h1>
          <p>
            Inicia sesión o regístrate y empieza a gestionar tu librería
            personal de una forma sencilla.
          </p>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
          <h2>
            Últimos libros añadidos
          </h2>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col">
          <Mosaic items={mosaicItems} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;

export const getServerSideProps = async () => {
  const latestBooks = await BibblisServerApi.getLatestBooks() || [];
  return {
    props: { latestBooks },
  };
};
