import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

export default function CompanyGrid() {
  const navigate = useNavigate();
  console.log('Fetching companies data');

  const { data: companies, isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, company_name, company_logo, company_username')
          .order('company_name');
        
        if (error) {
          console.error('Error fetching companies:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }
        
        console.log('Companies data:', data);
        return data;
      } catch (err) {
        console.error('Error in query function:', err);
        throw err;
      }
    }
  });

  if (isLoading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error in CompanyGrid:', error);
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center text-red-600">
          Error loading companies. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">
          Our Trusted Partners
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {companies?.map((company) => (
            <div 
              key={company.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center space-y-4"
            >
              {company.company_logo ? (
                <img 
                  src={company.company_logo} 
                  alt={`${company.company_name} logo`}
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                  {company.company_name.charAt(0)}
                </div>
              )}
              <h3 className="text-xl font-semibold text-primary">{company.company_name}</h3>
              <button 
                className="px-6 py-2 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors"
                onClick={() => navigate(`/${company.company_username}`)}
              >
                Log In
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}