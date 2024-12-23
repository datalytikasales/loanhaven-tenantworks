import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoanDetailsForm } from "@/components/forms/LoanDetailsForm";
import { GuarantorForm } from "@/components/forms/GuarantorForm";
import { CollateralForm } from "@/components/forms/CollateralForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loanSchema = z.object({
  principal: z.number().min(1, "Loan amount is required"),
  duration: z.number().min(1, "Duration is required"),
  duration_period: z.string(),
  loan_purpose: z.string().min(1, "Loan purpose is required"),
});

interface LoanApplicationFormProps {
  clientData: any;
  guarantors: any[];
  setGuarantors: (guarantors: any[]) => void;
  collaterals: any[];
  setCollaterals: (collaterals: any[]) => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  defaultValues?: any;
}

export function LoanApplicationForm({
  clientData,
  guarantors,
  setGuarantors,
  collaterals,
  setCollaterals,
  onSubmit,
  isLoading,
  defaultValues
}: LoanApplicationFormProps) {
  const form = useForm<z.infer<typeof loanSchema>>({
    resolver: zodResolver(loanSchema),
    defaultValues: defaultValues || {
      principal: 0,
      duration: 1,
      duration_period: "months",
      loan_purpose: "",
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent>
            <LoanDetailsForm form={form} defaultValues={defaultValues} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guarantors Information</CardTitle>
          </CardHeader>
          <CardContent>
            <GuarantorForm 
              guarantors={guarantors}
              setGuarantors={setGuarantors}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collateral Information</CardTitle>
          </CardHeader>
          <CardContent>
            <CollateralForm
              collaterals={collaterals}
              setCollaterals={setCollaterals}
            />
          </CardContent>
        </Card>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Loan Application"}
        </Button>
      </form>
    </Form>
  );
}