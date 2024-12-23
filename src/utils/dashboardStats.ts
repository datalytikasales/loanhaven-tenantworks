import { supabase } from "@/integrations/supabase/client";

export async function getCompanyStats(companyId: number, userRole?: string, userEmail?: string) {
  // Active loans query - using proper join syntax
  let activeLoansQuery = supabase
    .from('loans')
    .select(`
      *,
      clients!inner (
        company_id
      )
    `, { count: 'exact', head: true })
    .eq('loan_status', 'Active')
    .eq('clients.company_id', companyId);

  let clientsQuery = supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', companyId);

  // Pending loans query - using proper join syntax
  let pendingLoansQuery = supabase
    .from('loans')
    .select(`
      *,
      clients!inner (
        company_id
      )
    `, { count: 'exact', head: true })
    .eq('loan_status', 'Pending')
    .eq('clients.company_id', companyId);

  // Add manager-specific filters if needed
  if (userRole === 'manager' && userEmail) {
    activeLoansQuery = activeLoansQuery.eq('loan_applicant_email', userEmail);
    clientsQuery = clientsQuery.eq('onboarding_officer', userEmail);
    pendingLoansQuery = pendingLoansQuery.eq('loan_applicant_email', userEmail);
  }

  const [activeLoans, totalClients, pendingApplications] = await Promise.all([
    activeLoansQuery,
    clientsQuery,
    pendingLoansQuery
  ]);

  return {
    activeLoans: activeLoans.count || 0,
    totalClients: totalClients.count || 0,
    pendingApplications: pendingApplications.count || 0
  };
}

export async function getRecentApplications(companyId: number, userRole?: string, userEmail?: string) {
  let query = supabase
    .from('loans')
    .select(`
      loan_id,
      principal,
      created_at,
      loan_status,
      clients!inner (
        first_name,
        last_name,
        company_id
      )
    `)
    .eq('loan_status', 'Pending')
    .eq('clients.company_id', companyId);

  // Add manager-specific filter if needed
  if (userRole === 'manager' && userEmail) {
    query = query.eq('loan_applicant_email', userEmail);
  }

  const { data: applications, error } = await query
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching recent applications:", error);
    throw error;
  }

  return applications || [];
}

export async function getRecentClients(companyId: number, userRole?: string, userEmail?: string) {
  let query = supabase
    .from('clients')
    .select(`
      id,
      first_name,
      last_name,
      email,
      company_id,
      onboarding_officer
    `)
    .eq('company_id', companyId);

  // Add manager-specific filter if needed
  if (userRole === 'manager' && userEmail) {
    query = query.eq('onboarding_officer', userEmail);
  }

  const { data: clients, error } = await query
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching recent clients:", error);
    throw error;
  }

  if (!clients) return [];

  // Get loan counts for each client
  const clientsWithLoanCount = await Promise.all(
    clients.map(async (client) => {
      let loanQuery = supabase
        .from('loans')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', client.id);

      if (userRole === 'manager' && userEmail) {
        loanQuery = loanQuery.eq('loan_applicant_email', userEmail);
      }

      const { count } = await loanQuery;

      return {
        ...client,
        loanCount: count || 0
      };
    })
  );

  return clientsWithLoanCount;
}