import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CompanyDashboardLayout } from "@/components/company/CompanyDashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { generateLoanId } from "@/utils/loanUtils";
import { toast } from "sonner";
import { ClientSearchSection } from "@/components/loan/ClientSearchSection";
import { ClientInfoDisplay } from "@/components/loan/ClientInfoDisplay";
import { LoanApplicationForm } from "@/components/loan/LoanApplicationForm";

interface Guarantor {
  name: string;
  phone_number: string;
  national_id: string;
  place_of_work: string;
  id_photo_front: string;
  id_photo_back: string;
  passport_photo: string;
}

interface Collateral {
  name: string;
  value: number;
  pic_1: string;
  pic_2: string;
}

export default function LoanApplication() {
  const { companyUsername } = useParams();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clientData, setClientData] = useState<any>(null);
  const [showForms, setShowForms] = useState(false);
  const [guarantors, setGuarantors] = useState<Guarantor[]>([{
    name: "",
    phone_number: "",
    national_id: "",
    place_of_work: "",
    id_photo_front: "",
    id_photo_back: "",
    passport_photo: ""
  }]);
  const [collaterals, setCollaterals] = useState<Collateral[]>([{
    name: "",
    value: 0,
    pic_1: "",
    pic_2: ""
  }]);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!role || !["client", "manager", "admin"].includes(role)) {
      navigate(`/${companyUsername}`);
      return;
    }
    setUserRole(role);

    if (role === "client") {
      const clientEmail = localStorage.getItem("userEmail");
      if (clientEmail) {
        fetchClientDataByEmail(clientEmail);
      }
    }
  }, [companyUsername, navigate]);

  const fetchClientDataByEmail = async (email: string) => {
    try {
      const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("company_username", companyUsername)
        .single();

      if (!company) throw new Error("Company not found");

      const { data: client, error } = await supabase
        .from("clients")
        .select("*")
        .eq("email", email)
        .eq("company_id", company.id)
        .single();

      if (error) throw error;
      setClientData(client);
      setShowForms(true);
      toast.success("Client data loaded");
    } catch (error) {
      console.error("Error fetching client:", error);
      toast.error("Failed to load client data");
    }
  };

  const handleClientFound = (client: any) => {
    setClientData(client);
    setShowForms(!!client);
  };

  const handleSubmit = async (data: any) => {
    if (!clientData) {
      toast.error("Please search for a client first");
      return;
    }

    setIsLoading(true);
    try {
      // Get company data
      const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("company_username", companyUsername)
        .single();

      if (!company) throw new Error("Company not found");

      // Get user email
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        throw new Error("Please log in again to submit a loan application");
      }

      // Generate loan ID
      const loanId = await generateLoanId(company.id, companyUsername);

      // Create the loan with uppercase status
      const { data: loanData, error: loanError } = await supabase
        .from("loans")
        .insert({
          loan_id: loanId,
          client_id: clientData.id,
          principal: data.principal,
          loan_purpose: data.loan_purpose,
          status_change_date: new Date().toISOString(),
          loan_status: "Pending", // Changed to uppercase
          loan_applicant_email: userEmail,
          loan_applicant_role: userRole
        })
        .select()
        .single();

      if (loanError) throw loanError;

      // Add loan tenor
      const { error: tenorError } = await supabase
        .from("loan_tenor")
        .insert({
          loan_id: loanData.id,
          duration: data.duration,
          duration_period: data.duration_period
        });

      if (tenorError) throw tenorError;

      // Add guarantors if any
      if (guarantors.length > 0) {
        const { error: guarantorsError } = await supabase
          .from("guarantors")
          .insert(
            guarantors.map(g => ({
              loan_id: loanData.id,
              ...g
            }))
          );

        if (guarantorsError) throw guarantorsError;
      }

      // Add collaterals if any
      if (collaterals.length > 0) {
        const { error: collateralError } = await supabase
          .from("collateral")
          .insert(
            collaterals.map(c => ({
              loan_id: loanData.id,
              ...c
            }))
          );

        if (collateralError) throw collateralError;
      }

      toast.success("Loan application submitted successfully");
      setShowForms(false);
      setClientData(null);
      setGuarantors([{
        name: "",
        phone_number: "",
        national_id: "",
        place_of_work: "",
        id_photo_front: "",
        id_photo_back: "",
        passport_photo: ""
      }]);
      setCollaterals([{
        name: "",
        value: 0,
        pic_1: "",
        pic_2: ""
      }]);
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit loan application");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userRole) return null;

  return (
    <CompanyDashboardLayout userRole={userRole as "client" | "manager" | "admin"}>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Loan Application</h1>
        
        {userRole !== "client" && (
          <>
            <ClientSearchSection onClientFound={handleClientFound} />
            {clientData && <ClientInfoDisplay client={clientData} />}
          </>
        )}

        {(showForms || userRole === "client") && (
          <LoanApplicationForm
            clientData={clientData}
            guarantors={guarantors}
            setGuarantors={setGuarantors}
            collaterals={collaterals}
            setCollaterals={setCollaterals}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    </CompanyDashboardLayout>
  );
}
