const Footer = () => {
  return (
    <footer className="py-6 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>
          Product of{' '}
          <a 
            href="https://cpajoe.co.ke" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-accent hover:text-accent/80 transition-colors"
          >
            CJ's
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;