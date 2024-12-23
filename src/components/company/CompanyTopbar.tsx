import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CompanyTopbarProps {
  companyLogo?: string;
  companyName?: string;
  userName: string;
}

export function CompanyTopbar({ companyLogo, companyName, userName }: CompanyTopbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/');
  };

  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center px-4 py-4">
        <div className="flex items-center">
          {companyLogo && (
            <img
              src={companyLogo}
              alt={`${companyName} logo`}
              className="h-8 w-auto"
            />
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">{userName}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
          >
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}