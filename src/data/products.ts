import mensShirt1 from "@/assets/products/mens-shirt-1.jpg";
import mensBlazer1 from "@/assets/products/mens-blazer-1.jpg";
import mensTshirt1 from "@/assets/products/mens-tshirt-1.jpg";
import mensJeans1 from "@/assets/products/mens-jeans-1.jpg";
import mensShoes1 from "@/assets/products/mens-shoes-1.jpg";
import mensLeatherJacket from "@/assets/products/mens-leather-jacket.png";
import womensDress1 from "@/assets/products/womens-dress-1.jpg";
import womensTop1 from "@/assets/products/womens-top-1.jpg";
import womensSkirt1 from "@/assets/products/womens-skirt-1.jpg";
import womensFloralDress from "@/assets/products/womens-floral-dress.png";
import womensLeopardDress from "@/assets/products/womens-leopard-dress.png";
import womensBeignDress from "@/assets/products/womens-beige-dress.png";
import womensNavyFloral from "@/assets/products/womens-navy-floral.jpg";
import kidsTshirt from "@/assets/products/kids-tshirt.png";
import kidsOveralls from "@/assets/products/kids-overalls.png";
import kidsPartyDress from "@/assets/products/kids-party-dress.jpg";
import kidsKnitSweater from "@/assets/products/kids-knit-sweater.jpg";
import kidsSuit from "@/assets/products/kids-suit.png";
import kidsShorts from "@/assets/products/kids-shorts.png";

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
  { id: "m11", name: "Winter Puffer Jacket", price: 7999, category: "Outerwear", gender: "men", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", description: "Keep warm with this insulated, lightweight seasonal puffer jacket." },
  { id: "m12", name: "Leather Biker Jacket", price: 18999, category: "Outerwear", gender: "men", image: mensLeatherJacket, description: "Premium genuine leather jacket with asymmetric zip and hardware details." },

  // WOMEN
  { id: "w1", name: "Noir Cocktail Dress", price: 9999, category: "Dresses", gender: "women", image: womensDress1, description: "Elegant black cocktail dress with flowing silhouette." },
  { id: "w2", name: "Silk Champagne Blouse", price: 6499, category: "Tops", gender: "women", image: womensTop1, description: "Luxurious silk blouse in soft champagne hue." },
  { id: "w3", name: "Camel Pleated Skirt", price: 5499, category: "Skirts", gender: "women", image: womensSkirt1, description: "Elegant pleated midi skirt in warm camel." },
  { id: "w4", name: "Midnight Gown", price: 15999, category: "Dresses", gender: "women", image: womensDress1, description: "Show-stopping midnight black evening gown." },
  { id: "w5", name: "Pearl Satin Top", price: 4999, category: "Tops", gender: "women", image: womensFloralDress, description: "Delicate floral print long-sleeve mini dress with smocked bodice." },
  { id: "w6", name: "Taupe Midi Skirt", price: 4999, category: "Skirts", gender: "women", image: womensLeopardDress, description: "Bold leopard print V-neck dress with ruffled accents." },
  { id: "w7", name: "Sequin Party Dress", price: 12500, category: "Dresses", gender: "women", image: womensBeignDress, description: "Elegant beige V-neck A-line button-front midi dress." },
  { id: "w8", name: "Casual Denim Jacket", price: 4500, category: "Outerwear", gender: "women", image: womensNavyFloral, description: "Floral printed navy pleated chiffon dress with bow collar." },
  { id: "w9", name: "Summer Floral Maxi", price: 3999, category: "Dresses", gender: "women", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80", description: "Lightweight and flowy floral maxi dress perfect for summer days." },
  { id: "w10", name: "Cashmere Turtleneck", price: 8500, category: "Sweaters", gender: "women", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80", description: "Ultra-soft and warm pure cashmere turtleneck sweater." },

  // KIDS
  { id: "k1", name: "Play-Ready T-Shirt", price: 999, category: "T-Shirts", gender: "kids", image: kidsTshirt, description: "Durable and breathable organic cotton t-shirt for active kids." },
  { id: "k2", name: "Denim Overalls", price: 2499, category: "Pants", gender: "kids", image: kidsOveralls, description: "Classic washed denim overalls featuring adjustable straps and pockets." },
  { id: "k3", name: "Festive Party Dress", price: 3499, category: "Dresses", gender: "kids", image: kidsPartyDress, description: "Adorable tulle party dress perfect for birthdays and special occasions." },
  { id: "k4", name: "Cozy Knit Sweater", price: 1899, category: "Sweaters", gender: "kids", image: kidsKnitSweater, description: "Warm and soft knitted sweater to keep them comfortable during winter." },
  { id: "k5", name: "Little Gentleman Suit", price: 5999, category: "Suits", gender: "kids", image: kidsSuit, description: "A highly tailored 3-piece suit making sure the little ones stand out at formal gatherings." },
  { id: "k6", name: "Printed Summer Shorts", price: 899, category: "Shorts", gender: "kids", image: kidsShorts, description: "Lightweight and fun printed shorts for those sunny active days out." },
];
