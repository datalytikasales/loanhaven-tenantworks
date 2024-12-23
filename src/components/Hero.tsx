const Hero = () => {
  return (
    <div className="pt-24 pb-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-in">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">
              Revolutionizing Loan Management
            </h1>
            <p className="text-lg text-gray-600">
              Empower your lending business with our state-of-the-art platform. 
              Streamline operations, enhance client relationships, and scale your 
              business effortlessly.
            </p>
          </div>
          <div className="animate-slide-in [animation-delay:200ms]">
            <img 
              src="https://raw.githubusercontent.com/squarehaul/contributor_test/main/loan-finance.avif" 
              alt="Loan Finance Diagram" 
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;