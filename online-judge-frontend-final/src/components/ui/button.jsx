import React from 'react';
import classNames from 'classnames';

const Button = ({ className, children, ...props }) => {
  return (
    <button
      {...props}
      className={classNames(
        'inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded hover:bg-primary/90 transition',
        className
      )}
    >
      {children}
    </button>
  );
};

export { Button };
