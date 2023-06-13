import Link from 'next/link';

import { IMosaicItem } from '../types/i-mosaic-item';

interface IMosaicProps {
  items: IMosaicItem[];
}

const Mosaic = ({ items }: IMosaicProps) => {
  return (
    <div className="mosaic">
      {items.map(({ id, title, href, src}) => {
        return (
          <div className="mosaic-item" key={id}>
            <Link href={href} title={title}>
              <img src={src} alt={title} />
            </Link>
          </div>
        );
      })
      }
    </div>
  );
};

export default Mosaic;
