import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { Book } from '@prisma/client';
import ReactMarkdown from 'react-markdown'

import MainLayout from '../../layouts/MainLayout';

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
          <h3>
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
          </h3>
          <ReactMarkdown className="mt-4">
            {description}
          </ReactMarkdown>
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
  const res = await fetch(`http://localhost:3000/api/book/page-data/${bookId}`);
  const book: Book = await res.json();
  if (!book) {
    return {
      notFound: true,
    };
  }
  return {
    props: { book }, // will be passed to the page component as props
  };
};
