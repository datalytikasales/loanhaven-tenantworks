import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Attempting to login/register with:", { email, password });

    try {
      if (isRegistering) {
        const { error } = await supabase
          .from("admin")
          .insert([{ email, password }]);
        
        if (error) throw error;
        toast.success("Registration successful! Please login.");
        setIsRegistering(false);
      } else {
        const { data, error } = await supabase
          .from("admin")
          .select()
          .eq("email", email)
          .eq("password", password)
          .single();

        if (error) throw error;
        if (data) {
          localStorage.setItem("adminId", data.id.toString());
          navigate("/admin");
          toast.success("Login successful!");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(isRegistering ? "Registration failed!" : "Login failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {isRegistering ? "Register Admin Account" : "Admin Login"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading
                ? "Loading..."
                : isRegistering
                ? "Register"
                : "Sign in"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering
                ? "Already have an account? Login"
                : "Need an account? Register"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}