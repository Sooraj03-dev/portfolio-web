import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://sipkvcsyrucsqeotchrn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpcGt2Y3N5cnVjc3Flb3RjaHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0ODc0MDksImV4cCI6MjEwMTA2MzQwOX0.LrC8nh-WUby3rTltoKiwXBiFc6O-6YeIw-Ukj2hU9UI');

async function test() {
  const { data, error } = await supabase.from('projects').delete().in('id', [7, 8]).select();
  console.log('Delete result:', data, error);
}
test();
