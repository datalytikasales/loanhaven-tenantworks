import { supabase } from "@/integrations/supabase/client";

export async function generateClientId(companyId: number, companyUsername: string): Promise<string> {
  // Check if company has any existing clients in the tracker
  const { data: tracker, error: trackerError } = await supabase
    .from('client_id_tracker')
    .select('last_id')
    .eq('company_id', companyId)
    .maybeSingle();

  if (trackerError) {
    console.error("Error fetching client tracker:", trackerError);
    throw trackerError;
  }

  let nextNumber: number;
  if (!tracker) {
    // First client for this company
    nextNumber = 1;
    // Create first tracker entry
    const { error: insertError } = await supabase
      .from('client_id_tracker')
      .insert({
        company_id: companyId,
        last_id: '1'
      });
    
    if (insertError) {
      console.error("Error creating client tracker:", insertError);
      throw insertError;
    }
  } else {
    // Increment last ID
    nextNumber = parseInt(tracker.last_id) + 1;
    // Update tracker
    const { error: updateError } = await supabase
      .from('client_id_tracker')
      .update({ last_id: nextNumber.toString() })
      .eq('company_id', companyId);
    
    if (updateError) {
      console.error("Error updating client tracker:", updateError);
      throw updateError;
    }
  }

  // Format: company-cl-000001
  return `${companyUsername}-cl-${nextNumber.toString().padStart(6, '0')}`;
}

export async function generateManagerId(companyId: number, companyUsername: string): Promise<string> {
  console.log("Generating manager ID for company:", { companyId, companyUsername });
  
  // Check if company has any existing managers in the tracker
  const { data: tracker, error: trackerError } = await supabase
    .from('manager_id_tracker')
    .select('last_id')
    .eq('company_id', companyId)
    .maybeSingle();

  if (trackerError) {
    console.error("Error fetching manager tracker:", trackerError);
    throw trackerError;
  }

  let nextNumber: number;
  if (!tracker) {
    console.log("No existing manager tracker found, creating first entry");
    // First manager for this company
    nextNumber = 1;
    // Create first tracker entry
    const { error: insertError } = await supabase
      .from('manager_id_tracker')
      .insert({
        company_id: companyId,
        last_id: '1'
      });
    
    if (insertError) {
      console.error("Error creating manager tracker:", insertError);
      throw insertError;
    }
  } else {
    console.log("Existing manager tracker found:", tracker);
    // Increment last ID
    nextNumber = parseInt(tracker.last_id) + 1;
    // Update tracker
    const { error: updateError } = await supabase
      .from('manager_id_tracker')
      .update({ last_id: nextNumber.toString() })
      .eq('company_id', companyId);
    
    if (updateError) {
      console.error("Error updating manager tracker:", updateError);
      throw updateError;
    }
  }

  // Format: company-mn-000001
  const managerId = `${companyUsername}-mn-${nextNumber.toString().padStart(6, '0')}`;
  console.log("Generated manager ID:", managerId);
  return managerId;
}