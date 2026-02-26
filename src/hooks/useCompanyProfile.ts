import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface CompanyProfile {
  id?: string;
  company_name: string;
  product_description: string;
  target_audience: string;
  pain_points: string;
  unique_selling_points: string;
  additional_context: string;
}

const defaultProfile: CompanyProfile = {
  company_name: "",
  product_description: "",
  target_audience: "",
  pain_points: "",
  unique_selling_points: "",
  additional_context: "",
};

export function useCompanyProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["company-profile", user?.id],
    queryFn: async () => {
      if (!user) return defaultProfile;
      const { data, error } = await supabase
        .from("company_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data ?? defaultProfile;
    },
    enabled: !!user,
  });

  const saveMutation = useMutation({
    mutationFn: async (values: CompanyProfile) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("company_profiles")
        .upsert(
          { ...values, user_id: user.id, updated_at: new Date().toISOString() },
          { onConflict: "user_id" }
        );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-profile"] });
      toast.success("Firmenprofil gespeichert!");
    },
    onError: () => {
      toast.error("Fehler beim Speichern");
    },
  });

  return {
    profile: profile ?? defaultProfile,
    isLoading,
    save: saveMutation.mutate,
    isSaving: saveMutation.isPending,
  };
}
