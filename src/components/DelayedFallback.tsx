import React, { useState, useEffect } from 'react';

interface DelayedFallbackProps {
  children: React.ReactNode;
  delay?: number;
}

const DelayedFallback: React.FC<DelayedFallbackProps> = ({ children, delay = 500 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [delay]);

  return show ? <>{children}</> : null;
};

export default DelayedFallback;
