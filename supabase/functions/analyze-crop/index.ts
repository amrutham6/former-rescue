import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, cropType, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langMap: Record<string, string> = {
      en: "English", te: "Telugu", hi: "Hindi", mr: "Marathi", kn: "Kannada",
    };
    const langName = langMap[language] || "English";

    const messages: any[] = [
      {
        role: "system",
        content: `You are an agricultural AI crop analyzer. Analyze crop images and provide:
1. usable_percentage (0-100)
2. damage_level (minimal/low/moderate/high/severe)
3. suggestion (what the farmer should do)
4. analysis (detailed description)

Respond in ${langName}. Be practical and specific to Indian farming.

You MUST respond using the analyze_crop tool.`,
      },
      {
        role: "user",
        content: imageBase64 
          ? [
              { type: "text", text: `Analyze this ${cropType || 'crop'} image for viability.` },
              { type: "image_url", image_url: { url: imageBase64 } },
            ]
          : `Analyze a ${cropType || 'crop'} that the farmer describes as damaged. Give a realistic assessment.`,
      },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_crop",
              description: "Return crop viability analysis results",
              parameters: {
                type: "object",
                properties: {
                  usable_percentage: { type: "number", description: "Percentage of crop that is still usable (0-100)" },
                  damage_level: { type: "string", enum: ["minimal", "low", "moderate", "high", "severe"] },
                  suggestion: { type: "string", description: "What the farmer should do with this crop" },
                  analysis: { type: "string", description: "Detailed analysis of the crop condition" },
                },
                required: ["usable_percentage", "damage_level", "suggestion", "analysis"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_crop" } },
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI error:", response.status, t);
      return new Response(JSON.stringify({ error: "Analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "No analysis result" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
