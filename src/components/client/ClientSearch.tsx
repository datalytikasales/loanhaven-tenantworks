import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClientProfile } from "./ClientProfile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export function ClientSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"national_id" | "client_id">("national_id");

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', searchTerm, searchType],
    queryFn: async () => {
      if (!searchTerm) return null;
      
      try {
        const { data, error } = await supabase
          .from('clients')
          .select(`
            *,
            client_next_of_kin (*),
            loans (
              loan_id,
              principal,
              loan_status
            )
          `)
          .eq(searchType, searchTerm)
          .maybeSingle();
        
        if (error) throw error;
        
        if (!data) {
          toast.error(`No client found with this ${searchType === 'national_id' ? 'National ID' : 'Client ID'}`);
          return null;
        }
        
        return data;
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Error searching for client");
        return null;
      }
    },
    enabled: !!searchTerm
  });

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder={`Search by ${searchType === 'national_id' ? 'National ID' : 'Client ID'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setSearchType(searchType === 'national_id' ? 'client_id' : 'national_id')}
          >
            Switch to {searchType === 'national_id' ? 'Client ID' : 'National ID'}
          </Button>
        </div>

        {isLoading && <div>Loading...</div>}
        {client && <ClientProfile client={client} />}
      </Card>
    </div>
  );
}