import { useState } from "react";
import { useParams } from "react-router-dom";
import { CompanyDashboardLayout } from "@/components/company/CompanyDashboardLayout";
import { ManagerOnboardingForm } from "@/components/forms/ManagerOnboardingForm";
import { supabase } from "@/integrations/supabase/client";
import { generateManagerId } from "@/utils/idGenerator";
import { generateSecurePassword } from "@/utils/passwordGenerator";
import { toast } from "sonner";

export default function OnboardManager() {
  const { companyUsername } = useParams();
  const [isLoading, setIsLoading] = useState(false);

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

      // Check for existing manager with same email, phone, or national ID in this company
      const { data: existingManager } = await supabase
        .from("managers")
        .select("email, phone_number, national_id")
        .eq("company_id", company.id)
        .or(`email.eq.${data.email},phone_number.eq.${data.phoneNumber},national_id.eq.${data.nationalId}`)
        .maybeSingle();

      if (existingManager) {
        let errorMessage = "Manager already exists in this company with the same ";
        if (existingManager.email === data.email) errorMessage += "email address";
        else if (existingManager.phone_number === data.phoneNumber) errorMessage += "phone number";
        else if (existingManager.national_id === data.nationalId) errorMessage += "national ID";
        
        toast.error(errorMessage);
        return;
      }

      // Generate manager ID
      const managerId = await generateManagerId(company.id, companyUsername);

      // Generate password
      const password = generateSecurePassword();

      // Create manager record
      const { data: manager, error: managerError } = await supabase
        .from("managers")
        .insert({
          company_id: company.id,
          manager_id: managerId,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone_number: data.phoneNumber,
          national_id: data.nationalId,
          county: data.county,
          town_centre: data.townCentre,
          nssf: data.nssf,
          nhif: data.nhif,
          kra_pin: data.kraPIN,
          residence_nearest_building: data.residenceNearestBuilding,
          residence_nearest_road: data.residenceNearestRoad,
          dob: data.dob,
          gender: data.gender,
          id_photo_front: data.idPhotoFront,
          id_photo_back: data.idPhotoBack,
          date_of_onboarding: new Date().toISOString(),
        })
        .select()
        .single();

      if (managerError) throw managerError;

      // Create next of kin records
      for (const kin of nextOfKin) {
        const { error: kinError } = await supabase
          .from("manager_next_of_kin")
          .insert({
            manager_id: manager.id,
            name: kin.name,
            phone_number: kin.phone_number,
            relation: kin.relation
          });

        if (kinError) throw kinError;
      }

      // Create manager user account
      const { error: userError } = await supabase
        .from("app_manager_users")
        .insert({
          company_id: company.id,
          manager_id: manager.id,
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
          userType: "manager",
        },
      });

      if (emailError) throw emailError;

      toast.success("Manager onboarded successfully!");
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast.error("Failed to onboard manager");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CompanyDashboardLayout userRole="admin">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Onboard New Manager</h1>
        <ManagerOnboardingForm onSubmit={handleOnboard} isLoading={isLoading} />
      </div>
    </CompanyDashboardLayout>
  );
}