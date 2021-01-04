import React from 'react';
import { useStyling } from '../../services';

export const QuoteLayout = ({quote}) => {
  const { screenSize } = useStyling();

  return screenSize === 'lg' || screenSize === 'xl' ? (
    <section className={`auth__quote ${screenSize}-quote`}>
      <div className="container auth__quote__content">
        <h1 className="auth__quote__content--title">
          {quote.quote}
        </h1>
        <h2 className="auth__quote__content--author">
          - {quote.author}
        </h2>
      </div>
    </section>
  ) : ''
};