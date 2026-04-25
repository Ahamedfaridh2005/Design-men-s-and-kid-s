import mensShirt1 from "@/assets/products/mens-shirt-1.jpg";
import mensBlazer1 from "@/assets/products/mens-blazer-1.jpg";
import mensTshirt1 from "@/assets/products/mens-tshirt-1.jpg";
import mensJeans1 from "@/assets/products/mens-jeans-1.jpg";
import mensShoes1 from "@/assets/products/mens-shoes-1.jpg";
import mensLeatherJacket from "@/assets/products/mens-leather-jacket.png";
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
  gender: "men" | "kids";
  image: string;
  description: string;
}

export const products: Product[] = [];

