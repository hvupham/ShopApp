import { ProductImage } from "./product.image";
import { Comment } from "./comment";
export interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  description: string;
  category_id: number;
  url: string;
  product_images: ProductImage[];
  comments: Comment[];
}

  
  