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
  gender: "men" | "women" | "kids";
  image: string;
  description: string;
}

export const products: Product[] = [
  // MEN
  { id: "m1", name: "Noir Slim Fit Shirt", price: 4999, category: "Shirts", gender: "men", image: mensShirt1, description: "Premium black slim-fit cotton shirt with a refined finish." },
  { id: "m2", name: "Ivory Linen Blazer", price: 12999, category: "Blazers", gender: "men", image: mensBlazer1, description: "Luxurious beige linen blazer for the modern gentleman." },
  { id: "m3", name: "Essential White Tee", price: 2499, category: "T-Shirts", gender: "men", image: mensTshirt1, description: "Ultra-soft premium cotton t-shirt in pristine white." },
  { id: "m4", name: "Indigo Slim Jeans", price: 5999, category: "Jeans", gender: "men", image: mensJeans1, description: "Dark indigo slim-fit jeans with a refined stretch." },
  { id: "m5", name: "Tan Oxford Shoes", price: 8999, category: "Footwear", gender: "men", image: mensShoes1, description: "Handcrafted tan leather oxford shoes." },
  { id: "m6", name: "Charcoal Dress Shirt", price: 5499, category: "Shirts", gender: "men", image: mensShirt1, description: "Elegant charcoal dress shirt for formal occasions." },
  { id: "m7", name: "Navy Wool Blazer", price: 14999, category: "Blazers", gender: "men", image: mensBlazer1, description: "Structured navy wool blazer with gold-tone buttons." },
  { id: "m8", name: "Onyx Crew Neck Tee", price: 2999, category: "T-Shirts", gender: "men", image: mensTshirt1, description: "Premium crew neck t-shirt in deep black." },
  { id: "m9", name: "Casual Summer Polo", price: 1999, category: "T-Shirts", gender: "men", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80", description: "Breathable cotton polo shirt perfect for casual summer outings." },
  { id: "m10", name: "Classic Tuxedo Suit", price: 25000, category: "Suits", gender: "men", image: "https://images.unsplash.com/photo-1594938298596-10fe6b2a4c16?w=600&q=80", description: "A beautifully tailored classic tuxedo for elite formal events." },
  { id: "m11", name: "Winter Puffer Jacket", price: 7999, category: "Outerwear", gender: "men", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", description: "Keep warm with this insulated, lightweight seasonal puffer jacket." },
  { id: "m12", name: "Leather Biker Jacket", price: 18999, category: "Outerwear", gender: "men", image: "https://images.unsplash.com/photo-1520975954732-57dd22299614?w=600&q=80", description: "Premium genuine leather jacket with asymmetric zip and hardware details." },

  // WOMEN
  { id: "w1", name: "Noir Cocktail Dress", price: 9999, category: "Dresses", gender: "women", image: womensDress1, description: "Elegant black cocktail dress with flowing silhouette." },
  { id: "w2", name: "Silk Champagne Blouse", price: 6499, category: "Tops", gender: "women", image: womensTop1, description: "Luxurious silk blouse in soft champagne hue." },
  { id: "w3", name: "Camel Pleated Skirt", price: 5499, category: "Skirts", gender: "women", image: womensSkirt1, description: "Elegant pleated midi skirt in warm camel." },
  { id: "w4", name: "Midnight Gown", price: 15999, category: "Dresses", gender: "women", image: womensDress1, description: "Show-stopping midnight black evening gown." },
  { id: "w5", name: "Pearl Satin Top", price: 4999, category: "Tops", gender: "women", image: womensTop1, description: "Delicate pearl satin top with elegant draping." },
  { id: "w6", name: "Taupe Midi Skirt", price: 4999, category: "Skirts", gender: "women", image: womensSkirt1, description: "Flowing taupe midi skirt for effortless elegance." },
  { id: "w7", name: "Sequin Party Dress", price: 12500, category: "Dresses", gender: "women", image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80", description: "Sparkling sequin midi dress designed to catch everyone's attention at the party." },
  { id: "w8", name: "Casual Denim Jacket", price: 4500, category: "Outerwear", gender: "women", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=80", description: "Classic mid-wash denim jacket for an effortless everyday look." },
  { id: "w9", name: "Summer Floral Maxi", price: 3999, category: "Dresses", gender: "women", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80", description: "Lightweight and flowy floral maxi dress perfect for summer days." },
  { id: "w10", name: "Cashmere Turtleneck", price: 8500, category: "Sweaters", gender: "women", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80", description: "Ultra-soft and warm pure cashmere turtleneck sweater." },

  // KIDS
  { id: "k1", name: "Play-Ready T-Shirt", price: 999, category: "T-Shirts", gender: "kids", image: "https://images.unsplash.com/photo-1519238263530-99abca9665ae?w=600&q=80", description: "Durable and breathable organic cotton t-shirt for active kids." },
  { id: "k2", name: "Denim Overalls", price: 2499, category: "Pants", gender: "kids", image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80", description: "Classic washed denim overalls featuring adjustable straps and pockets." },
  { id: "k3", name: "Festive Party Dress", price: 3499, category: "Dresses", gender: "kids", image: "https://images.unsplash.com/photo-1601614749488-8240f95fc74f?w=600&q=80", description: "Adorable tulle party dress perfect for birthdays and special occasions." },
  { id: "k4", name: "Cozy Knit Sweater", price: 1899, category: "Sweaters", gender: "kids", image: "https://images.unsplash.com/photo-1522271810565-d698eacc57aa?w=600&q=80", description: "Warm and soft knitted sweater to keep them comfortable during winter." },
  { id: "k5", name: "Little Gentleman Suit", price: 5999, category: "Suits", gender: "kids", image: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=600&q=80", description: "A highly tailored 3-piece suit making sure the little ones stand out at formal gatherings." },
  { id: "k6", name: "Printed Summer Shorts", price: 899, category: "Shorts", gender: "kids", image: "https://images.unsplash.com/photo-1602910344008-22f323c28b5e?w=600&q=80", description: "Lightweight and fun printed shorts for those sunny active days out." },
];
