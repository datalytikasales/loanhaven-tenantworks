import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CompanyDashboardLayout } from "@/components/company/CompanyDashboardLayout";
import { ClientOnboardingForm } from "@/components/forms/ClientOnboardingForm";
import { supabase } from "@/integrations/supabase/client";
import { generateClientId } from "@/utils/idGenerator";
import { generateSecurePassword } from "@/utils/passwordGenerator";
import { toast } from "sonner";

export default function OnboardClient() {
  const { companyUsername } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Check authentication and role on component mount
  useState(() => {
    const userRole = localStorage.getItem("userRole");
    if (!userRole || (userRole !== "manager" && userRole !== "admin")) {
      navigate(`/${companyUsername}`);
      return;
    }
  });

  const handleOnboard = async (data: any, nextOfKin: any[]) => {
    setIsLoading(true);
    try {
      // Get company ID
      const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("company_username", companyUsername)
        .single();

      if (!company) throw new Error("Company not found");

      // Check for existing client with same email, phone, or national ID in this company
      const { data: existingClient } = await supabase
        .from("clients")
        .select("email, phone_number, national_id")
        .eq("company_id", company.id)
        .or(`email.eq.${data.email},phone_number.eq.${data.phoneNumber},national_id.eq.${data.nationalId}`)
        .maybeSingle();

      if (existingClient) {
        let errorMessage = "Client already exists in this company with the same ";
        if (existingClient.email === data.email) errorMessage += "email address";
        else if (existingClient.phone_number === data.phoneNumber) errorMessage += "phone number";
        else if (existingClient.national_id === data.nationalId) errorMessage += "national ID";
        
        toast.error(errorMessage);
        return;
      }

      // Generate client ID
      const clientId = await generateClientId(company.id, companyUsername);

      // Generate password
      const password = generateSecurePassword();

      // Create client record
      const { data: client, error: clientError } = await supabase
        .from("clients")
        .insert({
          company_id: company.id,
          client_id: clientId,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone_number: data.phoneNumber,
          national_id: data.nationalId,
          county: data.county,
          town_centre: data.townCentre,
          work_economic_activity: data.workEconomicActivity,
          place_of_work: data.placeOfWork,
          residence_nearest_building: data.residenceNearestBuilding,
          residence_nearest_road: data.residenceNearestRoad,
          date_of_birth: data.dateOfBirth,
          gender: data.gender,
          id_photo_front: data.idPhotoFront,
          id_photo_back: data.idPhotoBack,
          date_of_onboarding: new Date().toISOString(),
          onboarding_officer: "System",
          salary: data.salary
        })
        .select()
        .single();

      if (clientError) throw clientError;

      // Create next of kin records
      for (const kin of nextOfKin) {
        const { error: kinError } = await supabase
          .from("client_next_of_kin")
          .insert({
            client_id: client.id,
            name: kin.name,
            phone_number: kin.phone_number,
            relation: kin.relation,
            residence: kin.residence,
            national_id: kin.national_id,
            id_photo_front: kin.id_photo_front,
            id_photo_back: kin.id_photo_back
          });

        if (kinError) throw kinError;
      }

      // Create client user account
      const { error: userError } = await supabase
        .from("app_client_users")
        .insert({
          company_id: company.id,
          client_id: client.id,
          email: data.email,
          password: password,
        });

      if (userError) throw userError;

      // Send credentials via email
      const { error: emailError } = await supabase.functions.invoke("send-credentials", {
        body: {
          to: [data.email],
          companyName: companyUsername,
          email: data.email,
          password: password,
          userType: "client",
        },
      });

      if (emailError) throw emailError;

      toast.success("Client onboarded successfully!");
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast.error("Failed to onboard client");
    } finally {
      setIsLoading(false);
    }
  };

  const userRole = localStorage.getItem("userRole");
  
  return (
    <CompanyDashboardLayout userRole={userRole as "manager" | "admin"}>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Onboard New Client</h1>
        <ClientOnboardingForm onSubmit={handleOnboard} isLoading={isLoading} />
      </div>
    </CompanyDashboardLayout>
  );
}