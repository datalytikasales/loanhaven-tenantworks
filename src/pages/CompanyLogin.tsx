import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

type UserRole = "client" | "manager" | "admin";
type UserTable = "app_client_users" | "app_manager_users" | "app_admin_users";

export default function CompanyLogin() {
  const navigate = useNavigate();
  const { companyUsername } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("client");

  console.log('CompanyLogin mounted for company:', companyUsername);

  const { data: company, isError } = useQuery({
    queryKey: ['company', companyUsername],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('company_name, company_logo, id')
        .eq('company_username', companyUsername)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('Company not found');
      return data;
    }
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Attempting login with:', { email, password, role: selectedRole, company: companyUsername });

    try {
      if (!company?.id) {
        throw new Error('Company information not available');
      }

      let userTableName: UserTable;
      switch (selectedRole) {
        case 'admin':
          userTableName = 'app_admin_users';
          break;
        case 'manager':
          userTableName = 'app_manager_users';
          break;
        case 'client':
          userTableName = 'app_client_users';
          break;
      }

      console.log('Querying table:', userTableName, 'with company_id:', company.id);

      const { data: userData, error } = await supabase
        .from(userTableName)
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .eq('company_id', company.id)
        .maybeSingle();

      if (error) {
        console.error('Database error:', error);
        throw new Error('Failed to verify credentials');
      }

      if (!userData) {
        throw new Error('Invalid credentials or user not found');
      }

      localStorage.setItem("userRole", selectedRole);
      localStorage.setItem(`${selectedRole}Id`, userData.id.toString());
      localStorage.setItem("userEmail", email);
      
      const dashboardRoute = `/${companyUsername}/${selectedRole}/dashboard`;
      navigate(dashboardRoute);
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Company Not Found</h2>
          <p className="text-gray-600 mb-6">
            The company you're looking for doesn't exist or may have been moved.
          </p>
          <Button onClick={() => navigate('/')} variant="outline">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {company?.company_logo && (
                <img 
                  src={company.company_logo} 
                  alt={`${company.company_name} logo`}
                  className="h-8 w-auto"
                />
              )}
            </div>
            <div className="flex items-center">
              <Link to={`/${companyUsername}/about`} className="text-gray-600 hover:text-gray-900">
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome to {company?.company_name}
            </h2>
            <p className="mt-2 text-gray-600">Please select your role and sign in</p>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            {(['client', 'manager', 'admin'] as UserRole[]).map((role) => (
              <Button
                key={role}
                variant={selectedRole === role ? 'default' : 'outline'}
                onClick={() => setSelectedRole(role)}
                className="capitalize"
              >
                {role}
              </Button>
            ))}
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}