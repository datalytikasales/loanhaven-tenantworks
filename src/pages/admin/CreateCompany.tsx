import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CreateCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    company_username: "",
    company_password: "",
    company_logo: "",
    email: "",
    phone_number: "",
    contact_person_name: "",
    physical_address_county: "",
    physical_address_nearest_road: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Attempting to create company:", formData);

    try {
      // Start a transaction to create both company and admin user
      const { data: company, error: companyError } = await supabase
        .from("companies")
        .insert(formData)
        .select()
        .single();

      if (companyError) throw companyError;

      // Create admin user with company reference
      const { error: adminError } = await supabase
        .from("app_admin_users")
        .insert({
          company_id: company.id,
          email: formData.email,
          password: formData.company_password,
        });

      if (adminError) {
        // If admin user creation fails, we should ideally rollback the company creation
        // Since we don't have direct transaction support, we'll delete the company
        await supabase
          .from("companies")
          .delete()
          .eq("id", company.id);
        throw adminError;
      }

      toast.success("Company and admin user created successfully!");
      
      // Reset form
      setFormData({
        company_name: "",
        company_username: "",
        company_password: "",
        company_logo: "",
        email: "",
        phone_number: "",
        contact_person_name: "",
        physical_address_county: "",
        physical_address_nearest_road: "",
      });
    } catch (error) {
      console.error("Error creating company and admin:", error);
      toast.error("Failed to create company and admin user!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Company</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Name
            </label>
            <Input
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Username
            </label>
            <Input
              name="company_username"
              value={formData.company_username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Password
            </label>
            <Input
              type="password"
              name="company_password"
              value={formData.company_password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Logo URL
            </label>
            <Input
              name="company_logo"
              value={formData.company_logo}
              onChange={handleChange}
              placeholder="Enter logo URL"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <Input
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Contact Person Name
            </label>
            <Input
              name="contact_person_name"
              value={formData.contact_person_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              County
            </label>
            <Input
              name="physical_address_county"
              value={formData.physical_address_county}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Nearest Road
            </label>
            <Input
              name="physical_address_nearest_road"
              value={formData.physical_address_nearest_road}
              onChange={handleChange}
            />
          </div>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Company"}
        </Button>
      </form>
    </div>
  );
}