import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

export default function CompanyAbout() {
  const { companyUsername } = useParams();
  const navigate = useNavigate();

  const { data: company, isError } = useQuery({
    queryKey: ['company', companyUsername],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('company_name, company_logo')
        .eq('company_username', companyUsername)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('Company not found');
      return data;
    }
  });

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Company Not Found</h2>
          <p className="text-gray-600 mb-6">
            The company you're looking for doesn't exist or may have been moved.
          </p>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:text-primary/90"
          >
            Return to Home
          </button>
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
              <Link to={`/${companyUsername}`} className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            About {company?.company_name}
          </h1>
          
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <p className="text-gray-600">
              This is a placeholder about page for {company?.company_name}. 
              Content will be added here to describe the company's mission, 
              values, and services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}