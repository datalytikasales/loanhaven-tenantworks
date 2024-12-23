import { supabase } from "@/integrations/supabase/client";

export async function getCompanyStats(companyId: number) {
  // Get active loans count
  const { count: activeLoans } = await supabase
    .from('loans')
    .select('*', { count: 'exact', head: true })
    .eq('loan_status', 'Active');

  // Get total clients count
  const { count: totalClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', companyId);

  // Get pending applications count
  const { count: pendingApplications } = await supabase
    .from('loans')
    .select('*', { count: 'exact', head: true })
    .eq('loan_status', 'Pending');

  return {
    activeLoans: activeLoans || 0,
    totalClients: totalClients || 0,
    pendingApplications: pendingApplications || 0
  };
}

export async function getRecentApplications(companyId: number) {
  const { data: applications } = await supabase
    .from('loans')
    .select(`
      id,
      loan_id,
      principal,
      created_at,
      loan_status,
      clients (
        first_name,
        last_name
      )
    `)
    .eq('loan_status', 'Pending')
    .order('id', { ascending: false })
    .limit(5);

  return applications || [];
}

export async function getRecentClients(companyId: number) {
  // First get the 5 most recent clients
  const { data: clients } = await supabase
    .from('clients')
    .select(`
      id,
      first_name,
      last_name,
      email,
      company_id
    `)
    .eq('company_id', companyId)
    .order('id', { ascending: false })
    .limit(5);

  if (!clients) return [];

  // Then for each client, get their loan count
  const clientsWithLoanCount = await Promise.all(
    clients.map(async (client) => {
      const { count } = await supabase
        .from('loans')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', client.id);

      return {
        ...client,
        loanCount: count || 0
      };
    })
  );

  return clientsWithLoanCount;
}