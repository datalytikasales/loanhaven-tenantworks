import { supabase } from "@/integrations/supabase/client";

export async function getCompanyStats(companyId: number, userRole?: string, userEmail?: string) {
  let activeLoansQuery = supabase
    .from('loans')
    .select('*', { count: 'exact', head: true })
    .eq('loan_status', 'Active')
    .eq('company_id', companyId);

  let clientsQuery = supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', companyId);

  let pendingLoansQuery = supabase
    .from('loans')
    .select('*', { count: 'exact', head: true })
    .eq('loan_status', 'Pending')
    .eq('company_id', companyId);

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
      id,
      loan_id,
      principal,
      created_at,
      loan_status,
      loan_applicant_email,
      clients (
        first_name,
        last_name
      )
    `)
    .eq('loan_status', 'Pending')
    .eq('company_id', companyId);

  // Add manager-specific filter if needed
  if (userRole === 'manager' && userEmail) {
    query = query.eq('loan_applicant_email', userEmail);
  }

  const { data: applications } = await query
    .order('id', { ascending: false })
    .limit(5);

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

  const { data: clients } = await query
    .order('id', { ascending: false })
    .limit(5);

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