import React from 'react';

export const Code = ({code, setCode}) => {
  const checkChange = (e) => {
    const value = e.target.value;
    const fields = document.getElementsByClassName("code__input");
    const index = Number(e.target.id);

    setCode({
      ...code,
      [index]: value,
    });

    if (value.length >= 1) {
      index !== 3 && fields[index+1].focus();
    };
  };

  return (
    <div className="code">
      <input className="code__input" onChange={(e) => checkChange(e)} maxLength={1} name="code-0" id="0" />
      <input className="code__input" onChange={(e) => checkChange(e)} maxLength={1} name="code-0" id="1" />
      <input className="code__input" onChange={(e) => checkChange(e)} maxLength={1} name="code-0" id="2" />
      <input className="code__input" onChange={(e) => checkChange(e)} maxLength={1} name="code-0" id="3" />
    </div>
  );
};
