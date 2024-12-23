import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CompanyDashboardLayout } from "@/components/company/CompanyDashboardLayout";
import { LoanApplicationForm } from "@/components/loan/LoanApplicationForm";
import { toast } from "sonner";
import { useState } from "react";

export default function EditLoan() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const loanId = location.state?.loanId;
  console.log("Loan ID from state:", loanId); // Debug log

  // Redirect if no loanId is provided
  if (!loanId) {
    console.log("No loan ID found, redirecting..."); // Debug log
    navigate("/admin/loan-approval");
    return null;
  }

  const { data: loanData, isLoading } = useQuery({
    queryKey: ['edit-loan', loanId],
    queryFn: async () => {
      console.log("Fetching loan data for ID:", loanId); // Debug log
      const { data, error } = await supabase
        .from('loans')
        .select(`
          *,
          loan_tenor (
            duration,
            duration_period
          ),
          guarantors (*),
          collateral (*),
          clients (
            first_name,
            last_name,
            email,
            phone_number,
            national_id
          )
        `)
        .eq('loan_id', loanId)
        .single();

      if (error) {
        console.error("Error fetching loan data:", error); // Debug log
        throw error;
      }
      console.log("Fetched loan data:", data); // Debug log
      return data;
    }
  });

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting updated loan data:", data); // Debug log

      // Update loan details
      const { error: loanError } = await supabase
        .from('loans')
        .update({
          principal: data.principal,
          loan_purpose: data.loan_purpose,
        })
        .eq('loan_id', loanId);

      if (loanError) throw loanError;

      // Update loan tenor
      const { error: tenorError } = await supabase
        .from('loan_tenor')
        .update({
          duration: data.duration,
          duration_period: data.duration_period
        })
        .eq('loan_id', loanData?.id);

      if (tenorError) throw tenorError;

      // Update guarantors
      const { error: guarantorsError } = await supabase
        .from('guarantors')
        .delete()
        .eq('loan_id', loanData?.id);

      if (guarantorsError) throw guarantorsError;

      const { error: newGuarantorsError } = await supabase
        .from('guarantors')
        .insert(
          data.guarantors.map((g: any) => ({
            loan_id: loanData?.id,
            ...g
          }))
        );

      if (newGuarantorsError) throw newGuarantorsError;

      // Update collateral
      const { error: collateralError } = await supabase
        .from('collateral')
        .delete()
        .eq('loan_id', loanData?.id);

      if (collateralError) throw collateralError;

      const { error: newCollateralError } = await supabase
        .from('collateral')
        .insert(
          data.collaterals.map((c: any) => ({
            loan_id: loanData?.id,
            ...c
          }))
        );

      if (newCollateralError) throw newCollateralError;

      toast.success("Loan application updated successfully");
      navigate("/admin/loan-approval");
    } catch (error) {
      console.error("Error updating loan:", error);
      toast.error("Failed to update loan application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !loanData) {
    return (
      <CompanyDashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-full">
          <div>Loading...</div>
        </div>
      </CompanyDashboardLayout>
    );
  }

  const formattedData = {
    ...loanData,
    duration: loanData.loan_tenor[0]?.duration,
    duration_period: loanData.loan_tenor[0]?.duration_period,
  };

  return (
    <CompanyDashboardLayout userRole="admin">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Loan Application</h1>
        <LoanApplicationForm
          clientData={loanData.clients}
          guarantors={loanData.guarantors || []}
          setGuarantors={() => {}}
          collaterals={loanData.collateral || []}
          setCollaterals={() => {}}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          defaultValues={formattedData}
        />
      </div>
    </CompanyDashboardLayout>
  );
}