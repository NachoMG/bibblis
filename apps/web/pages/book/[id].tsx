import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { Book } from '@prisma/client';
import ReactMarkdown from 'react-markdown'

import MainLayout from '../../layouts/MainLayout';
import BibblisServerApi from '../../utils/api/BibblisServerApi';

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
  const cover = book.cover || '';

  const hasOtherEditions = book.work.books?.length > 0;

  return (
    <MainLayout>
      <div className="row mt-5">
        <div className="col-3">
          <img src={cover} alt={book.title} className="img-fluid" />
          <div className="mt-4">
            { book.pages && <p className="my-1"><b>Páginas</b> <span>{book.pages}</span></p> }
            { book.publisher && <p className="my-1"><b>Editorial</b> <span>{book.publisher}</span></p> }
            { book.publishedAt && <p className="my-1"><b>Fecha de publicación</b> <span>{book.publishedAt}</span></p> }
          </div>
        </div>
        <div className="col-9">
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
          <ReactMarkdown className="mt-4">
            {description}
          </ReactMarkdown>
          { hasOtherEditions &&
            <>
              <h3 className="mt-5">Otras ediciones</h3>
              <div className="row mt-4">
                {book.work.books.map((book, index) => (
                  <div className="col-2" key={book.id}>
                    <Link href={`/book/${book.id}`} title={book.title}>
                      <img src={book.cover || ''} alt={book.title} className="img-fluid" />
                    </Link>
                  </div>
                ))}
              </div>
            </>
          }
        </div>
      </div>
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
