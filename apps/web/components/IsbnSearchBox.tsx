import { useState } from 'react';
import Link from 'next/link';

import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import Image from 'next/image';

const IsbnSearchBox = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<any>([]);

  const onSearch = (query: string) => {
    if ([10, 13].includes(query.length)) {
      setIsLoading(true);
      fetch(`http://localhost:3000/api/book/search/${query}`)
      .then(resp => resp.json())
      .then((json) => {
        setOptions([json]);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  };


  const renderMenuItemChildren = (option) => (
    <div className="row">
      <div className="col-3">
        <img src={option.cover} alt={option.title} width="100%" />
      </div>
      <div className="col-9">
        <Link href={`/book/${option.id}`}>
          {option.title}
        </Link>
      </div>
    </div>
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
