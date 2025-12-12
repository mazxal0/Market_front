import api from "./axios";


// API функция с фильтрами
export async function getAllProcessors(filters: {
  cores?: string[];
  frequencies?: string[];
  brands?: string[];
  priceAsc?: boolean;
}) {
  const params: Record<string, string> = {};

  if (filters.cores && filters.cores.length > 0) params.cores = filters.cores.join(',');
  if (filters.frequencies && filters.frequencies.length > 0) params.frequencies = filters.frequencies.join(',');
  if (filters.brands && filters.brands.length > 0) params.brands = filters.brands.join(',');
  if (filters.priceAsc !== undefined) params.price_asc = String(filters.priceAsc);

  const { data } = await api.get('/processor', { params });
  return data.processors;
}

export async function getAllFlashDrivers(filters: {
  capacities?: number[];     // capacity_gb
  usbInterfaces?: string[];  // usb_interface
  priceAsc?: boolean;
}) {
  const params: Record<string, string> = {};

  if (filters.capacities && filters.capacities.length > 0) {
    params.capacities = filters.capacities.join(',');
  }

  if (filters.usbInterfaces && filters.usbInterfaces.length > 0) {
    params.usb_interfaces = filters.usbInterfaces.join(',');
  }

  if (filters.priceAsc !== undefined) {
    params.price_asc = String(filters.priceAsc);
  }

  const { data } = await api.get('/flash-driver', { params });
  return data.flash_drives; // или data.flashs, зависит как у тебя в бэке
}

export async function getProcessorById(id: string) {
  const { data } = await api.get(`/processor/${id}`);
  return data.processor;
}


export async function getFlashDriveById(id: string) {
  const { data } = await api.get(`/flash-driver/${id}`);
  return data.flash_drive;
}
