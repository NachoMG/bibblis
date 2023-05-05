import { PropsWithChildren } from 'react';

import Header from '../components/Header';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <Header />
      <div className="container bg-white py-5 px">
        { children }
      </div>
    </div>
  );
};

export default MainLayout;