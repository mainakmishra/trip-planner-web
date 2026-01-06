import React from 'react';

function Footer() {
  return (
    <footer className="mt-16 pt-8 border-t border-gray-100">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Trip Planner</p>
      </div>
    </footer>
  );
}

export default Footer;
