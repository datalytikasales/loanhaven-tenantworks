import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <video className="h-8 w-auto" autoPlay loop muted playsInline>
              <source src="https://raw.githubusercontent.com/squarehaul/contributor_test/main/solendr-new-design-logo.mp4" type="video/mp4" />
            </video>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost">About</Button>
            <Button variant="ghost">FAQ</Button>
            <Button variant="ghost">Help</Button>
          </div>

          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Button variant="ghost" className="w-full justify-start">About</Button>
            <Button variant="ghost" className="w-full justify-start">FAQ</Button>
            <Button variant="ghost" className="w-full justify-start">Help</Button>
          </div>
        </div>
      )}
    </nav>
  );
}