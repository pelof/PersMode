
export type Product = {
  id: number;
  product_name: string;
  product_description: string;
  product_image: string;
  product_brand: string;
  product_SKU: string;
  product_slug: string;
  product_published: string; // ISO-datum (t.ex. "2025-08-26")
  product_category: string; //TODO ta bort?
  product_price: number;
  quantity: number;
};
export type Category = {

  id: number;
  name: string;
  slug: string;
  product_image: string;
  created_at: string;
};
