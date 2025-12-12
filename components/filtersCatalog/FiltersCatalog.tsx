import {getAllFlashDrivers, getAllProcessors} from "@/api/catalog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FiltersCatalog() {
  const router = useRouter()
  const pathname = usePathname();
  const searchParams = useSearchParams()

  const queryClient = useQueryClient();

  const [selectedCores, setSelectedCores] = useState<string[]>([]);
  const coreOptions = [
    {value: '1', label: '1 ядро'},
    {value: '2', label: '2 ядра'},
    {value: '3', label: '3 ядра'},
    {value: '4', label: '4 ядра'},
    {value: '6', label: '6 ядер'},
    {value: '8', label: '8 ядер'},
    {value: '12', label: '12 ядер'},
    {value: '16', label: '16 ядер'},
  ];

  const [selectFrequency, setSelectFrequency] = useState<string[]>([]);
  const frequencyOptions = [
    {value: '2.5', label: '2.5 GHz'},
    {value: '2.6', label: '2.6 GHz'},
    {value: '2.8', label: '2.8 GHz'},
    {value: '3', label: '3 GHz'},
    {value: '3.1', label: '3.1 GHz'},
    {value: '3.3', label: '3.3 GHz'},
    {value: '3.4', label: '3.4 GHz'},
    {value: '3.7', label: '3.7 GHz'},
  ]

  const [selectDataVolume, setSelectDataVolume] = useState<string[]>([]);
  const dataVolumeOptions = [
    {value: '2', label: '2 Gb'},
    {value: '4', label: '4 Gb'},
    {value: '6', label: '6 Gb'},
    {value: '8', label: '8 Gb'},
    {value: '16', label: '16 Gb'},
    {value: '32', label: '32 Gb'},
    {value: '64', label: '64 Gb'},
  ]

  const [selectInterface, setSelectInterface] = useState<string[]>([])
  const interfaceOptions = [
    { value: 'USB-A', label: 'USB-A' },
    { value: 'USB-C', label: 'USB-C' },
    { value: 'Micro-USB', label: 'Micro-USB' },
    { value: 'Lightning', label: 'Lightning' },
  ];

  const [brands, setBrands] = useState<string[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [priceAsc, setPriceAsc] = useState<boolean>(true)

  const [limit, setLimit] = useState<number>(20)

  const updateQuery = (params: Record<string, any>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.length > 0 ? newSearchParams.set(key, value.join(",")) : newSearchParams.delete(key);
      } else if (value !== undefined && value !== null) {
        newSearchParams.set(key, value.toString());
      } else {
        newSearchParams.delete(key);
      }
    });

    router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

  // Хэндлеры
  const handleCoresChange = (values: string[]) => { setSelectedCores(values); updateQuery({ cores: values }); };
  const handleFrequencyChange = (values: string[]) => { setSelectFrequency(values); updateQuery({ frequencies: values }); };
  const handleBrandsChange = (values: string[], val: string) => {
    let newBrands: string[];

    if (values.includes(val)) {
      newBrands = values.filter(i => i !== val);
    } else {
      newBrands = [...values, val];
    }

    setBrands(newBrands);
    updateQuery({ brands: newBrands });
  };
  // Хэндлер выбора типов продукта
  const handleProductTypesChange = (type: string) => {
    let newTypes: string[];

    if (productTypes.includes(type)) {
      // Убираем тип, если он уже выбран
      newTypes = productTypes.filter(t => t !== type);
    } else {
      // Добавляем новый тип
      newTypes = [...productTypes, type];
    }

    setProductTypes(newTypes);
    updateQuery({ product_types: newTypes.length > 0 ? newTypes : undefined });
  };

  const handleDataVolumeChange = (values: string[]) => { setSelectDataVolume(values); updateQuery({ capacities: values }); };
  const handleInterfaceChange = (values: string[]) => { setSelectInterface(values); updateQuery({ interfaces: values }); };
  const handlePriceSort = () => { const newAsc = priceAsc === null ? true : !priceAsc; setPriceAsc(newAsc); updateQuery({ price_asc: newAsc }); };

  // Инициализация из URL
  useEffect(() => {
    const cores = searchParams.has("cores") ? searchParams.get("cores")!.split(",") : [];
    const frequencies = searchParams.has("frequencies") ? searchParams.get("frequencies")!.split(",") : [];
    const brands = searchParams.has("brands") ? searchParams.get("brands")!.split(",") : [];
    const capacities = searchParams.has("capacities") ? searchParams.get("capacities")!.split(",") : [];
    const interfaces = searchParams.has("interfaces") ? searchParams.get("interfaces")!.split(",") : [];
    const productTypes = searchParams.has("product_types") ? searchParams.get("product_types")!.split(",") : [];
    const priceAscParam = searchParams.has("price_asc") ? searchParams.get("price_asc") === "true" : null;

    // Обновляем все состояния асинхронно через setTimeout 0, чтобы избежать каскадных рендеров
    setTimeout(() => {
      setSelectedCores(cores);
      setSelectFrequency(frequencies);
      setBrands(brands);
      setProductTypes(productTypes);
      setSelectDataVolume(capacities);
      setSelectInterface(interfaces);
      setPriceAsc(!!priceAscParam);
    }, 0);
  }, [searchParams]);

  const { data: processors, isLoading, error, refetch: procRefetch } = useQuery({
    queryKey: [
      'processors',
      selectedCores.join(','),
      selectFrequency.join(','),
      brands.join(','),
      priceAsc
    ],
    queryFn: () =>
      getAllProcessors({
        cores: selectedCores,
        frequencies: selectFrequency,
        brands: brands,
        priceAsc: priceAsc
      }),
    enabled: productTypes.includes('processors'),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: flashs,
    isLoading: flLoading,
    error: flError,
    refetch: flRefetch,
  } = useQuery({
    queryKey: [
      'flash-drivers',
      selectDataVolume.join(','),
      selectInterface.join(','),
      priceAsc
    ], // обязательно включаем filters
    queryFn: () => getAllFlashDrivers({
      capacities: selectDataVolume.map(Number),
      usbInterfaces: selectInterface,
      priceAsc: priceAsc
    }),
    enabled: productTypes.includes('flash-drivers'),
    staleTime: 5 * 60 * 1000
  });


  useEffect(() => {
    if (!productTypes.includes('processors')) {
      queryClient.removeQueries({ queryKey: ['processors'] });
    }
    if (productTypes.includes('flash-drivers')) {
      queryClient.removeQueries({queryKey: ['flash-drivers']})
    }
  }, [productTypes, queryClient]);

  return {
    coreOptions,
    frequencyOptions,
    dataVolumeOptions,
    interfaceOptions,
    productTypes,
    selectedCores,
    selectFrequency,
    selectDataVolume,
    selectInterface,
    limit,
    setLimit,
    handleCoresChange,
    handleFrequencyChange,
    handleBrandsChange,
    handleProductTypesChange,
    handleDataVolumeChange,
    handleInterfaceChange,
    handlePriceSort,
    priceAsc,
    brands,
    processors,
    isLoading,
    error,
    procRefetch,

    flashs,
    flLoading,
    flError,
    flRefetch,
  }
}
