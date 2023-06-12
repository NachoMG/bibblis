import { useState } from 'react';
import Link from 'next/link';

import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import 'react-bootstrap-typeahead/css/Typeahead.css';

import BibblisClientApi from '../utils/api/BibblisClientApi';

const IsbnSearchBox = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<any>([]);

  const onSearch = async (query: string) => {
    if ([10, 13].includes(query.length)) {
      setIsLoading(true);
      const book = await BibblisClientApi.searchBook(query);
      if (book) {
        setOptions([book]);
      } else {
        setOptions([]);
      }
    } else {
      setOptions([]);
    }
    setIsLoading(false);
  };

  const renderMenuItemChildren = (option: any) => (
    <Link href={`/book/${option.id}`}>
      <div className="row">
        <div className="col-3">
          <img src={option.cover || '/default-book.jpg'} alt={option.title} width="100%" />
        </div>
        <div className="col-9">
          {option.title}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="isbn-search-box">
      <div className="position-relative">
        <AsyncTypeahead
          id="myid"
          labelKey={(option: any) => `${option.title}`}
          isLoading={isLoading}
          options={options}
          onSearch={onSearch}
          promptText="Introduce un ISBN válido"
          renderMenuItemChildren={renderMenuItemChildren}
          filterBy={() => true}
        />
        { !isLoading
          && <FontAwesomeIcon className="isbn-search-box--icon" icon={faSearch} size="1x" />
        }
      </div>
    </div>
  );
};

export default IsbnSearchBox;
