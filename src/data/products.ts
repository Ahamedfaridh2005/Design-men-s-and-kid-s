import mensShirt1 from "@/assets/products/mens-shirt-1.jpg";
import mensBlazer1 from "@/assets/products/mens-blazer-1.jpg";
import mensTshirt1 from "@/assets/products/mens-tshirt-1.jpg";
import mensJeans1 from "@/assets/products/mens-jeans-1.jpg";
import mensShoes1 from "@/assets/products/mens-shoes-1.jpg";
import womensDress1 from "@/assets/products/womens-dress-1.jpg";
import womensTop1 from "@/assets/products/womens-top-1.jpg";
import womensSkirt1 from "@/assets/products/womens-skirt-1.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  gender: "men" | "women";
  image: string;
  description: string;
}

export const products: Product[] = [
  { id: "m1", name: "Noir Slim Fit Shirt", price: 4999, category: "Shirts", gender: "men", image: mensShirt1, description: "Premium black slim-fit cotton shirt with a refined finish." },
  { id: "m2", name: "Ivory Linen Blazer", price: 12999, category: "Blazers", gender: "men", image: mensBlazer1, description: "Luxurious beige linen blazer for the modern gentleman." },
  { id: "m3", name: "Essential White Tee", price: 2499, category: "T-Shirts", gender: "men", image: mensTshirt1, description: "Ultra-soft premium cotton t-shirt in pristine white." },
  { id: "m4", name: "Indigo Slim Jeans", price: 5999, category: "Jeans", gender: "men", image: mensJeans1, description: "Dark indigo slim-fit jeans with a refined stretch." },
  { id: "m5", name: "Tan Oxford Shoes", price: 8999, category: "Footwear", gender: "men", image: mensShoes1, description: "Handcrafted tan leather oxford shoes." },
  { id: "m6", name: "Charcoal Dress Shirt", price: 5499, category: "Shirts", gender: "men", image: mensShirt1, description: "Elegant charcoal dress shirt for formal occasions." },
  { id: "m7", name: "Navy Wool Blazer", price: 14999, category: "Blazers", gender: "men", image: mensBlazer1, description: "Structured navy wool blazer with gold-tone buttons." },
  { id: "m8", name: "Onyx Crew Neck Tee", price: 2999, category: "T-Shirts", gender: "men", image: mensTshirt1, description: "Premium crew neck t-shirt in deep black." },
  { id: "w1", name: "Noir Cocktail Dress", price: 9999, category: "Dresses", gender: "women", image: womensDress1, description: "Elegant black cocktail dress with flowing silhouette." },
  { id: "w2", name: "Silk Champagne Blouse", price: 6499, category: "Tops", gender: "women", image: womensTop1, description: "Luxurious silk blouse in soft champagne hue." },
  { id: "w3", name: "Camel Pleated Skirt", price: 5499, category: "Skirts", gender: "women", image: womensSkirt1, description: "Elegant pleated midi skirt in warm camel." },
  { id: "w4", name: "Midnight Gown", price: 15999, category: "Dresses", gender: "women", image: womensDress1, description: "Show-stopping midnight black evening gown." },
  { id: "w5", name: "Pearl Satin Top", price: 4999, category: "Tops", gender: "women", image: womensTop1, description: "Delicate pearl satin top with elegant draping." },
  { id: "w6", name: "Taupe Midi Skirt", price: 4999, category: "Skirts", gender: "women", image: womensSkirt1, description: "Flowing taupe midi skirt for effortless elegance." },
];
