import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';

import { Author } from '@prisma/client'; 
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

import BibblisServerApi from '../../utils/api/BibblisServerApi';
import MainLayout from '../../layouts/MainLayout';

interface AuthorPageProps {
  author: Author & {
    works: {
      books: {
        id: string;
        title: string;
        cover: string;
      }[];
    }[];
  }
}

const AuthorPage = ({ author }: AuthorPageProps) => {
  const authorImage = author.image || '/default-author.jpg';

  return (
    <MainLayout>
      <div className="row mt-5">
        <div className="col-3">
          <img src={authorImage} alt={author.name} className="img-fluid" />
        </div>
        <div className="col-9">
          <h1>{author.name}</h1>
          {author.birthDate &&
            <h3>{author.birthDate}</h3>
          }
          {author.bio &&
            <ReactMarkdown className="mt-4">
              {author.bio}
            </ReactMarkdown>
          }
        </div>
        <h2 className="mt-5">
          Obras
        </h2>
        <div className="row mt-4">
          {author.works.map((work) => {
            const book = work.books[0];
            const bookCover = book.cover || '/default-book.jpg';
            return (
              <div className="col-2" key={book.id}>
                <Link href={`/book/${book.id}`} title={book.title}>
                  <img src={bookCover} alt={book.title} className="img-fluid" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default AuthorPage;

export const getServerSideProps = async (context: GetServerSidePropsContext<{ id: string }>) => {
  const authorId = context.params?.id;
  if (!authorId) {
    return {
      notFound: true,
    };
  }
  const author = await BibblisServerApi.getAuthorPageData(authorId);
  if (!author) {
    return {
      notFound: true,
    };
  }
  return {
    props: { author },
  };
};
