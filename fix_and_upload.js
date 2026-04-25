import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'products');

const SEEDED_IMAGES = {
  'Noir Slim Fit Shirt': 'mens-shirt-1.jpg',
  'Ivory Linen Blazer': 'mens-blazer-1.jpg',
  'Essential White Tee': 'mens-tshirt-1.jpg',
  'Noir Cocktail Dress': 'womens-dress-1.jpg',
  'Silk Champagne Blouse': 'womens-top-1.jpg',
  'Play-Ready T-Shirt': 'kids-tshirt.png'
};

async function main() {
  console.log('Fetching products...');
  const { data: products, error } = await supabase.from('products').select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  for (const product of products) {
    let fileName = SEEDED_IMAGES[product.name];

    if (!fileName) {
      console.log(`No seeded image mapping for ${product.name}, skipping upload.`);
      continue;
    }

    const filePath = path.join(ASSETS_DIR, fileName);

    if (fs.existsSync(filePath)) {
      console.log(`Uploading ${fileName} for product ${product.name}...`);
      
      const fileBuffer = fs.readFileSync(filePath);
      
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
  
  console.log('Done!');
}

main();
