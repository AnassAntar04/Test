import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type"
};

const supabase = createClient(
  // env vars set from dashboard or CLI
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // important to create users
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const { email, password } = await req.json();

  // Create user in Supabase Auth
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400
    });
  }

  return new Response(JSON.stringify({ id: data.user?.id }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
});












