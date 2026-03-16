// ============================================================
//  EXPENSE MANAGER — Cloudflare Worker (Notion Proxy)
//  Deploy this at: https://workers.cloudflare.com
//  This solves the CORS "Failed to fetch" error.
// ============================================================

// ✅ PASTE YOUR VALUES HERE:
const NOTION_TOKEN = "secret_PASTE_YOUR_TOKEN_HERE";
const NOTION_DB_ID = "PASTE_YOUR_DATABASE_ID_HERE";  // 32 chars, no dashes

// ============================================================

export default {
  async fetch(request) {

    // Allow CORS from any origin (your HTML form)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle browser preflight request
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();

      const { date, name, amount, payment, receipt, notes } = body;

      // Build Notion page payload
      const notionPayload = {
        parent: { database_id: NOTION_DB_ID },
        properties: {
          "Expense Name": {
            title: [{ text: { content: name } }]
          },
          "Date": {
            date: { start: date }
          },
          "Amount": {
            number: parseFloat(amount)
          },
          "Payment Mode": {
            select: { name: payment }
          },
          "Receipt Taken": {
            checkbox: receipt === "yes"
          }
        }
      };

      if (notes && notes.trim()) {
        notionPayload.properties["Notes"] = {
          rich_text: [{ text: { content: notes } }]
        };
      }

      // Forward to Notion API
      const notionRes = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + NOTION_TOKEN,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28"
        },
        body: JSON.stringify(notionPayload)
      });

      const result = await notionRes.json();

      if (!notionRes.ok) {
        return new Response(JSON.stringify({ error: result.message || "Notion error" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({ success: true, id: result.id }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
