import MainLayout from '../../layouts/MainLayout';

const Book = () => {
  return (
    <MainLayout>
      test
    </MainLayout>
  );
};

export default Book;

export async function getServerSideProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
};