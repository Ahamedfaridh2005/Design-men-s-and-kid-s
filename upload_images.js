import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'products');

async function main() {
  console.log('Fetching products...');
  const { data: products, error } = await supabase.from('products').select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  for (const product of products) {
    console.log(`Product: ${product.name}, image_url: ${product.image_url}`);
    if (!product.image_url) continue;

    // Check if the image_url is just a filename (e.g., mens-shirt-1.jpg)
    if (!product.image_url.startsWith('http') && !product.image_url.startsWith('blob:')) {
      let fileName = product.image_url;
      if (fileName.startsWith('/assets/products/')) {
        fileName = fileName.replace('/assets/products/', '');
      } else if (fileName.startsWith('/')) {
        fileName = fileName.substring(1);
      }
      const filePath = path.join(ASSETS_DIR, fileName);

      if (fs.existsSync(filePath)) {
        console.log(`Uploading ${fileName} for product ${product.name}...`);
        
        const fileBuffer = fs.readFileSync(filePath);
        
        // Infer content type
        let contentType = 'image/jpeg';
        if (fileName.endsWith('.png')) contentType = 'image/png';
        if (fileName.endsWith('.webp')) contentType = 'image/webp';
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, fileBuffer, {
            contentType,
            upsert: true
          });

        if (uploadError) {
          console.error(`Failed to upload ${fileName}:`, uploadError);
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        const newUrl = publicUrlData.publicUrl;
        
        console.log(`Updating product ${product.name} to new URL: ${newUrl}`);
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ image_url: newUrl })
          .eq('id', product.id);

        if (updateError) {
          console.error(`Failed to update product ${product.name}:`, updateError);
        } else {
          console.log(`Successfully updated ${product.name}`);
        }
      } else {
        console.warn(`File not found: ${filePath}`);
      }
    }
  }
  
  console.log('Done!');
}

main();
