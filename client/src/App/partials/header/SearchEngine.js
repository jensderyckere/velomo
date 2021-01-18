import React from 'react';

// Images
import { SearchSVG } from '../../components';

export const SearchEngine = () => {
  return (
    <div className="search-engine-header">
      <form>
        <button type="submit">
          <SearchSVG />
        </button>
        <input type="text" name="keywords" id="keywords"/>
      </form>
    </div>
  );
};
