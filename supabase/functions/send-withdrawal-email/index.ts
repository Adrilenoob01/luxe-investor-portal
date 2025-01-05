import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WithdrawalEmailRequest {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  iban: string;
  amount: number;
  netAmount: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, address, phone, iban, amount, netAmount }: WithdrawalEmailRequest = await req.json();

    const emailContent = `
      Nouvelle demande de retrait par virement bancaire:
      
      Prénom: ${firstName}
      Nom: ${lastName}
      Adresse: ${address}
      Téléphone: ${phone}
      IBAN: ${iban}
      Montant demandé: ${amount}€
      Frais: 0.50€
      Montant net: ${netAmount}€
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "WearShop Invest <noreply@wearshops.fr>",
        to: ["contact@wearshops.fr"],
        subject: `Nouvelle demande de retrait - ${firstName} ${lastName}`,
        text: emailContent,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to send email");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);