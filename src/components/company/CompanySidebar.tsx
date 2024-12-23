import { useParams, useNavigate } from 'react-router-dom';
import { Home, Users, Settings, FileText, CreditCard, HelpCircle, UserPlus, LogOut, CheckCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type UserRole = "client" | "manager" | "admin";

interface CompanySidebarProps {
  userRole: UserRole;
}

const menuItems = {
  client: [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: CreditCard, label: 'Apply for Loan', path: '/loan-application' },
    { icon: FileText, label: 'Documents', path: '/documents' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
  ],
  manager: [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Clients', path: '/clients' },
    { icon: Search, label: 'Client Search', path: '/client-search' },
    { icon: Search, label: 'Loan Search', path: '/loan-search' },
    { icon: UserPlus, label: 'Onboard Client', path: '/onboard-client' },
    { icon: CreditCard, label: 'New Loan Application', path: '/loan-application' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ],
  admin: [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: Search, label: 'Client Search', path: '/client-search' },
    { icon: Search, label: 'Loan Search', path: '/loan-search' },
    { icon: UserPlus, label: 'Onboard Manager', path: '/onboard-manager' },
    { icon: UserPlus, label: 'Onboard Client', path: '/onboard-client' },
    { icon: CreditCard, label: 'New Loan Application', path: '/loan-application' },
    { icon: CheckCircle, label: 'Loan Approval', path: '/loan-approval' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ],
};

export function CompanySidebar({ userRole }: CompanySidebarProps) {
  const { companyUsername } = useParams();
  const navigate = useNavigate();
  const items = menuItems[userRole];

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("managerId");
    localStorage.removeItem("clientId");
    localStorage.removeItem("userRole");
    navigate(`/${companyUsername}`);
    toast.success("Logged out successfully");
  };

  const handleNavigation = (path: string) => {
    const fullPath = `/${companyUsername}/${userRole}${path}`;
    console.log('Navigating to:', fullPath);
    navigate(fullPath);
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-primary">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {items.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-start text-primary-foreground hover:bg-primary/90"
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            ))}
            
            <Button
              variant="ghost"
              className="w-full justify-start text-primary-foreground hover:bg-primary/90 mt-auto"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}