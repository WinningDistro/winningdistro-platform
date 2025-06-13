import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-green text-black border-t-4 border-gold">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-black font-medium mb-4 md:mb-0">
            &copy; 2025 WinningDistro. All Rights Reserved.
          </p>
          <nav className="flex space-x-6">
            <Link
              to="/terms"
              className="text-black font-bold hover:text-gold transition-colors"
            >
              TERMS
            </Link>
            <Link
              to="/privacy"
              className="text-black font-bold hover:text-gold transition-colors"
            >
              PRIVACY
            </Link>
            <Link
              to="/support"
              className="text-black font-bold hover:text-gold transition-colors"
            >
              SUPPORT
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
