import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { searchClientByNationalId } from "@/utils/loanUtils";

interface ClientSearchProps {
  onClientFound: (clientData: any) => void;
}

export function ClientSearchSection({ onClientFound }: ClientSearchProps) {
  const form = useForm({
    defaultValues: {
      nationalId: "",
    }
  });

  const handleSearchClient = async (nationalId: string) => {
    if (!nationalId) {
      toast.error("Please enter a National ID");
      return;
    }

    try {
      const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("company_username", window.location.pathname.split('/')[1])
        .single();

      if (!company) throw new Error("Company not found");

      const client = await searchClientByNationalId(nationalId, company.id);
      onClientFound(client);
      toast.success(`Client found: ${client.first_name} ${client.last_name}. You can now proceed with the loan application.`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Client not found");
      onClientFound(null);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Client Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Input
            placeholder="Enter National ID"
            {...form.register("nationalId")}
          />
          <Button
            onClick={() => handleSearchClient(form.getValues("nationalId"))}
          >
            Search Client
          </Button>
        </div>
        
      </CardContent>
    </Card>
  );
}