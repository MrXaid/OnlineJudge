// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-center py-4 text-sm text-muted-foreground">
      © {new Date().getFullYear()} OnlineJudge. All rights reserved.
    </footer>
  );
};

export default Footer;
