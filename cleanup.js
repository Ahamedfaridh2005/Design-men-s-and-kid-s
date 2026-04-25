const SUPABASE_URL = "https://eyioktvmwuhhsoohzulr.supabase.co";
const SUPABASE_KEY = "sb_publishable_Vron9vDt3VdGaAHdmb2gjg_hGaNaeJ0";

async function cleanup() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?gender=eq.women`, {
    method: "DELETE",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    }
  });

  if (res.ok) {
    const data = await res.json();
    console.log("Deleted women products:", data.length);
  } else {
    console.error("Failed to delete products", await res.text());
  }
}

cleanup();
