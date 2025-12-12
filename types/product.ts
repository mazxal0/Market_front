export interface ProductForCatalog {
  id: string;
  productType: ProductType;
  image_url: string;
  name: string;
  retail_price: number;
  wholesale_price: number;
}

export enum ProductType {
  Processor = 'P',
  FlashDriver = 'FD'
}

export interface ProcessorWithImagesDTO {
  id: string;               // uuid
  sku: string;
  name: string;
  brand: string;
  retail_price: number;
  wholesale_price: number;
  wholesale_min_qty: number;
  stock: number;
  line: string;
  architecture: string;
  socket: string;
  base_frequency: number;
  turbo_frequency: number;
  cores: number;
  threads: number;
  l1_cache: string;
  l2_cache: string;
  l3_cache: string;
  lithography: string;
  tdp: number;
  features: string;
  memory_type: string;
  max_ram: string;
  max_ram_frequency: string;
  integrated_graphics: boolean;
  graphics_model: string;
  max_temperature: number;
  package_contents: string;
  country_of_origin: string;
  count_orders: number;
  image_urls: string[];
}

export interface FlashDriveWithImagesDTO {
  id: string;               // uuid
  sku: string;
  name: string;
  brand: string;
  retail_price: number;
  wholesale_price: number;
  wholesale_min_qty: number;
  stock: number;

  capacity_gb: number;
  usb_interface: string;
  form_factor: string;
  read_speed: number;
  write_speed: number;
  chip_type: string;
  otg_support: boolean;
  body_material: string;
  color: string;
  water_resistance: boolean;
  dust_resistance: boolean;
  shockproof: boolean;
  cap_type: string;

  length_mm: number;
  width_mm: number;
  thickness_mm: number;
  weight_g: number;

  compatibility: string;
  operating_temp: string;
  storage_temp: string;
  country_of_origin: string;
  package_contents: string;
  warranty_months: number;
  features: string;
  count_orders: number;
  image_urls: string[];
}

export interface CartProduct {
  id: string;
  image_url: string;
  price: number;
  product_id: string;
  quantity: number;
  name: string
}

export interface CreateProcessor {
  name: string;
  brand: string;
  retail_price: number;
  wholesale_price: number;
  wholesale_min_qty: number;
  stock: number;

  line: string;
  architecture: string;
  socket: string;

  base_frequency: number;
  turbo_frequency: number;
  cores: number;
  threads: number;

  l1_cache: string;
  l2_cache: string;
  l3_cache: string;

  lithography: string;
  tdp: number;

  features: string;
  memory_type: string;
  max_ram: string;
  max_ram_frequency: string;

  integrated_graphics: boolean;
  graphics_model: string;

  max_temperature: number;
  package_contents: string;
  country_of_origin: string;

  images: File[]; // <--- корректный тип
}

export interface CreateFlashDriver {
  name: string;
  brand: string;
  retail_price: number;
  wholesale_price: number;
  wholesale_min_qty: number;
  stock: number;

  capacity_gb: number;
  usb_interface: string;
  form_factor: string;
  read_speed: number;
  write_speed: number;
  chip_type: string;
  otg_support: boolean;
  body_material: string;
  color: string;
  water_resistance: boolean;
  dust_resistance: boolean;
  shockproof: boolean;
  cap_type: string;

  length_mm: number;
  width_mm: number;
  thickness_mm: number;
  weight_g: number;

  compatibility: string;
  operating_temp: string;
  storage_temp: string;
  country_of_origin: string;
  package_contents: string;
  warranty_months: number;
  features: string;

  images: File[];
}
