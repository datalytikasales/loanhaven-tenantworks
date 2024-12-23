import { supabase } from "@/integrations/supabase/client";

export async function generateLoanId(companyId: number, companyUsername: string): Promise<string> {
  // Check if company has any existing loans in the tracker
  const { data: tracker, error: trackerError } = await supabase
    .from('loan_id_tracker')
    .select('last_id')
    .eq('company_id', companyId)
    .maybeSingle();  // Use maybeSingle() instead of single()

  if (trackerError) {
    console.error("Error fetching loan tracker:", trackerError);
    throw trackerError;
  }

  let nextNumber: number;
  
  if (!tracker) {
    // First loan for this company
    nextNumber = 1;
    // Create first tracker entry
    const { error: insertError } = await supabase
      .from('loan_id_tracker')
      .insert({
        company_id: companyId,
        last_id: '1'
      });
    
    if (insertError) {
      console.error("Error creating loan tracker:", insertError);
      throw insertError;
    }
  } else {
    // Increment last ID
    nextNumber = parseInt(tracker.last_id) + 1;
    // Update tracker
    const { error: updateError } = await supabase
      .from('loan_id_tracker')
      .update({ last_id: nextNumber.toString() })
      .eq('company_id', companyId);
    
    if (updateError) {
      console.error("Error updating loan tracker:", updateError);
      throw updateError;
    }
  }

  // Format: company-ln-000001
  return `${companyUsername}-ln-${nextNumber.toString().padStart(6, '0')}`;
}

export async function updateLoanStatus(loanId: number, status: string) {
  const { error } = await supabase
    .from('loan_status_change')
    .insert({
      loan_id: loanId,
      loan_status: status,
      loan_status_date: new Date().toISOString().split('T')[0]
    });

  if (error) throw error;
}

export async function searchClientByNationalId(nationalId: string, companyId: number) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('national_id', nationalId)
    .eq('company_id', companyId)
    .single();

  if (error) throw error;
  return data;
}