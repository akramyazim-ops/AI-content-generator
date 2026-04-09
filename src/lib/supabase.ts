import { createClient } from "@supabase/supabase-js";

// Initialize Supabase.
// These variables should be added in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
  },
});

// Helper function to insert usage history
export async function trackGenerationUsage(
  userId: string,
  productName: string,
  businessType: string,
  contentType: string,
  generatedContent: string
) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) return;
    
    const { error } = await supabase
      .from("generations")
      .insert([
        { 
          user_id: userId, 
          product_name: productName,
          business_type: businessType,
          content_type: contentType,
          generated_content: generatedContent,
          created_at: new Date().toISOString() 
        }
      ]);
      
    if (error) throw error;
  } catch (error) {
    console.error("Supabase tracking error:", error);
  }
}
