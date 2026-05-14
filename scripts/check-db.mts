import * as dotenv from "dotenv";

dotenv.config();

async function checkDb() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return;
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/subjects?select=count`, {
    headers: {
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`,
      "Prefer": "count=exact"
    }
  });

  if (!res.ok) {
    console.error("Error fetching subjects:", await res.text());
    return;
  }

  const count = res.headers.get("Content-Range")?.split("/")[1];
  console.log("Subjects count:", count);

  const resChapters = await fetch(`${supabaseUrl}/rest/v1/chapters?select=count`, {
    headers: {
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`,
      "Prefer": "count=exact"
    }
  });
  const countChapters = resChapters.headers.get("Content-Range")?.split("/")[1];
  console.log("Chapters count:", countChapters);
}

checkDb();
