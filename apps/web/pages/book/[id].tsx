import { useEffect, useState } from 'react';

import { GetServerSidePropsContext } from 'next';

import Link from 'next/link';

import { Book } from '@prisma/client';

import ReactMarkdown from 'react-markdown'

import AccessToken from '../../utils/AccessToken';
import BibblisClientApi from '../../utils/api/BibblisClientApi';
import BibblisServerApi from '../../utils/api/BibblisServerApi';
import MainLayout from '../../layouts/MainLayout';
import Mosaic from '../../components/Mosaic';
import Head from 'next/head';

interface BookPageProps {
  book: Book & {
    work: {
        description: string;
        books: Book[];
        authors: {
          id: string;
          name: string;
        }[];
    };
  }
}

const BookPage = ({ book }: BookPageProps) => {
  const description = book.description || book.work.description;
  const cover = book.cover || '/default-book.jpg';
  const mosaicItems = (book.work.books || []).map((book) => ({
    id: book.id,
    title: book.title,
    href: `/book/${book.id}`,
    src: book.cover || '/default-book.jpg',
  }));

  const hasOtherEditions = mosaicItems.length > 0;

  const [showBookButton, setShowBookButton] = useState(false);
  const [hasBook, setHasBook] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);

  useEffect(() => {
    setShowBookButton(false);
    setHasBook(false);
    setDisabledButton(false);
    const loggedIn = !!AccessToken.get();
    if (loggedIn) {
      BibblisClientApi.getUserBook(book.id).then((res) => {
        if (res) {
          setHasBook(true);
        }
        setShowBookButton(true);
      });
    }
  }, [book.id]);

  const addBook = async () => {
    setDisabledButton(true);
    const result = await BibblisClientApi.addUserBook(book.id);
    if (result) {
      setHasBook(true);
    }
    setDisabledButton(false);
  }

  const removeBook = async () => {
    setDisabledButton(true);
    const result = await BibblisClientApi.removeUserBook(book.id);
    if (result) {
      setHasBook(false);
    }
    setDisabledButton(false);
  }

  return (
    <MainLayout>
      <Head>
        <title>{book.title} | Bibblis</title>
        <meta
          name="description"
          content={
            `Añade ${book.title} a tu biblioteca y empieza a disfrutar de Bibblis`
          }
        />
      </Head>
      <div className="row mt-5">
        <div className="col-12 mb-3 d-md-none">
          <h1>{book.title}</h1>
          <p className="h3">
            Por
            {book.work.authors.map((author, index: number) => (
              <span key={author.id}>
                { index !== 0 && ','}
                {' '}
                <Link href={`/author/${author.id}`}>
                  {author.name}
                </Link>
              </span>
            ))}
          </p>
        </div>
        <div className="col-12 col-md-3 text-center">
          <img src={cover} alt={book.title} className="img-fluid" />
          {showBookButton &&
            <div className="mt-2">
              {hasBook &&
                <button
                  className="btn btn-secondary w-100"
                  onClick={removeBook}
                  disabled={disabledButton}
                >
                  Eliminar libro
                </button>
              ||
                <button
                  className="btn btn-primary w-100"
                  onClick={addBook}
                  disabled={disabledButton}
                >
                  Añadir libro
                </button>
              }
            </div>
          }
          <div className="mt-3">
            {book.pages &&
              <p className="my-1">
                <b>Páginas</b> <span>{book.pages}</span>
              </p>
            }
            {book.publisher &&
              <p className="my-1">
                <b>Editorial</b> <span>{book.publisher}</span>
              </p>
            }
            {book.publishedAt &&
              <p className="my-1">
                <b>Fecha de publicación</b> <span>{book.publishedAt}</span>
              </p>
            }
          </div>
        </div>
        <div className="col-12 col-md-9">
          <div className="d-none d-md-block">
            <h1>{book.title}</h1>
            <p className="h3">
              Por
              {book.work.authors.map((author, index: number) => (
                <span key={author.id}>
                  { index !== 0 && ','}
                  {' '}
                  <Link href={`/author/${author.id}`}>
                    {author.name}
                  </Link>
                </span>
              ))}
            </p>
          </div>
          <ReactMarkdown className="mt-4">
            {description}
          </ReactMarkdown>
        </div>
      </div>
      {hasOtherEditions &&
        <>
          <div className="row mt-5">
            <div className="col">
              <h2>Otras ediciones</h2>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col">
              <Mosaic items={mosaicItems} />
            </div>
          </div>
        </>
      }
    </MainLayout>
  );
};

export default BookPage;

export const getServerSideProps = async (context: GetServerSidePropsContext<{ id: string }>) => {
  const bookId = context.params?.id;
  if (!bookId) {
    return {
      notFound: true,
    };
  }
  const book = await BibblisServerApi.getPageBookData(bookId);
  if (!book) {
    return {
      notFound: true,
    };
  }
  return {
    props: { book },
  };
};
