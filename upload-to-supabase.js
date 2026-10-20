import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.argv[2] || process.env.SUPABASE_URL || '';
const supabaseKey = process.argv[3] || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || '';

console.log('========================================================');
console.log('       Smart Planner -> Supabase Cloud Uploader         ');
console.log('========================================================');

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ Supabase URL ya Key provide nahi ki gayi hai.');
  console.log('\nUsage Options:');
  console.log('1. Command line se run karein:');
  console.log('   node upload-to-supabase.js <SUPABASE_URL> <SUPABASE_ANON_KEY>');
  console.log('\n2. Ya .env file me set karein:');
  console.log('   SUPABASE_URL=https://your-project.supabase.co');
  console.log('   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...');
  process.exit(1);
}

const cleanUrl = supabaseUrl.replace(/\/+$/, '');
const userFiles = [
  path.join(__dirname, 'user_databases', 'user_aaryan@gmail.com.json'),
  path.join(__dirname, 'planner-data.json')
];

let targetFile = userFiles.find(f => fs.existsSync(f));
if (!targetFile) {
  console.error('❌ Koi local planner data file nahi mili.');
  process.exit(1);
}

const rawData = fs.readFileSync(targetFile, 'utf8');
const parsedData = JSON.parse(rawData);
const email = targetFile.includes('user_aaryan') ? 'aaryan@gmail.com' : 'default@smartplanner.app';

console.log(`\n📦 File to upload: ${path.basename(targetFile)}`);
console.log(`👤 Account email: ${email}`);
console.log(`🌐 Supabase Target: ${cleanUrl}\n`);

const payload = {
  email: email,
  user_id: targetFile.includes('user_aaryan') ? '40cd2069-1523-4ec6-9b19-860b4e9bf445' : undefined,
  data: parsedData,
  updated_at: new Date().toISOString()
};

async function upload() {
  try {
    const endpoint = `${cleanUrl}/rest/v1/user_planner?on_conflict=user_id`;
    console.log(`🚀 Uploading to: ${endpoint} ...`);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      console.log('✅ SUCCESS! Planner data successfully uploaded to Supabase!');
      const data = await res.json();
      console.log('Cloud Response:', JSON.stringify(data, null, 2));
    } else {
      const errText = await res.text();
      console.error(`\n❌ Upload Error (${res.status}):`, errText);
      console.log('\n💡 Tip: Agar table nahi bani hui hai to Supabase Dashboard > SQL Editor me run karein:');
      console.log(`
create table if not exists public.user_planner (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_planner enable row level security;
create policy "Allow all on user_planner" on public.user_planner for all using (true) with check (true);
      `);
    }
  } catch (err) {
    console.error('❌ Network / Fetch Exception:', err.message);
  }
}

upload();
