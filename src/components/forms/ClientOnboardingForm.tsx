import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { NextOfKinForm } from "./NextOfKinForm";

const clientSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().min(10),
  nationalId: z.string().min(6),
  county: z.string().min(2),
  townCentre: z.string().min(2),
  workEconomicActivity: z.string().min(2),
  placeOfWork: z.string().min(2),
  residenceNearestBuilding: z.string().min(2),
  residenceNearestRoad: z.string().min(2),
  dateOfBirth: z.string(),
  gender: z.string(),
  idPhotoFront: z.string(),
  idPhotoBack: z.string(),
  salary: z.number().min(0),
});

const personalInfoFields = [
  { name: "firstName", label: "First Name" },
  { name: "lastName", label: "Last Name" },
  { name: "email", label: "Email" },
  { name: "phoneNumber", label: "Phone Number" },
  { name: "nationalId", label: "National ID" },
  { name: "county", label: "County" },
  { name: "townCentre", label: "Town Centre" },
  { name: "workEconomicActivity", label: "Work/Economic Activity" },
  { name: "placeOfWork", label: "Place of Work" },
  { name: "salary", label: "Monthly Salary", type: "number" },
  { name: "residenceNearestBuilding", label: "Nearest Building" },
  { name: "residenceNearestRoad", label: "Nearest Road" },
  { name: "dateOfBirth", label: "Date of Birth", type: "date" },
  { 
    name: "gender", 
    label: "Gender",
    type: "select",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" }
    ]
  },
  { name: "idPhotoFront", label: "ID Photo Front" },
  { name: "idPhotoBack", label: "ID Photo Back" },
];

interface ClientOnboardingFormProps {
  onSubmit: (data: z.infer<typeof clientSchema>, nextOfKin: any[]) => Promise<void>;
  isLoading: boolean;
}

interface NextOfKin {
  name: string;
  phone_number: string;
  relation: string;
  residence: string;
  national_id: string;
  id_photo_front: string;
  id_photo_back: string;
}

export function ClientOnboardingForm({ onSubmit, isLoading }: ClientOnboardingFormProps) {
  const [nextOfKin, setNextOfKin] = useState<NextOfKin[]>([{ 
    name: "", 
    phone_number: "", 
    relation: "",
    residence: "",
    national_id: "",
    id_photo_front: "",
    id_photo_back: ""
  }]);

  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      salary: 0,
    }
  });

  const handleSubmit = async (data: z.infer<typeof clientSchema>) => {
    await onSubmit(data, nextOfKin);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalInfoForm form={form} fields={personalInfoFields} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next of Kin</CardTitle>
          </CardHeader>
          <CardContent>
            <NextOfKinForm 
              nextOfKin={nextOfKin} 
              setNextOfKin={setNextOfKin}
              includeIdDetails={true}
            />
          </CardContent>
        </Card>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Onboarding..." : "Onboard Client"}
        </Button>
      </form>
    </Form>
  );
}