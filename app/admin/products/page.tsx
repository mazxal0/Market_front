'use client'
import {MultiSelectCustom} from "@/components/ComboboxSelector/ComboboxSelector";
import {Button, Group, Paper, Stack, Title, Text, Box, Loader, Switch, Image, TextInput, Textarea } from "@mantine/core";
import {useEffect, useState } from "react";
import {ReformatImageUrlLink} from "@/utils/reformatImageUrlLink";
import {ProductForCatalog, ProductType} from "@/types";
import ProductModal from "@/components/Modals/ProductModal";
import FiltersCatalog from "@/components/filtersCatalog/FiltersCatalog";
import AdminCartCatalog from "@/components/ProductCardCatalog/AdminCartCatalog";
import {cartStore} from "@/stores/cartStore";
import {userStore} from "@/stores";
import { useRouter } from "next/navigation";


const Price = ({ rotate }: { rotate: number }) => {
  const shouldMirror = rotate === 180;

  return (
    <div
      style={{
        transform: `
          rotate(${rotate}deg)
          ${shouldMirror ? 'scaleX(-1)' : ''}
        `,
        transformOrigin: 'center'
      }}
    >
      <svg width="22" height="17"
           viewBox="0 0 22 17" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd"
              d="M3.75024 0C3.94916 0 4.13992 0.0790178 4.28057 0.21967C4.42123 0.360322 4.50024 0.551088 4.50024 0.75V15.75C4.50024 15.9489 4.42123 16.1397 4.28057 16.2803C4.13992 16.421 3.94916 16.5 3.75024 16.5C3.55133 16.5 3.36057 16.421 3.21991 16.2803C3.07926 16.1397 3.00024 15.9489 3.00024 15.75V0.75C3.00024 0.551088 3.07926 0.360322 3.21991 0.21967C3.36057 0.0790178 3.55133 0 3.75024 0Z"
              fill="#EAEAEA"/>
        <path fillRule="evenodd" clipRule="evenodd"
              d="M7.28195 12.219C7.35179 12.2887 7.40721 12.3714 7.44502 12.4626C7.48283 12.5537 7.50229 12.6513 7.50229 12.75C7.50229 12.8487 7.48283 12.9463 7.44502 13.0374C7.40721 13.1286 7.35179 13.2113 7.28195 13.281L4.28195 16.281C4.21228 16.3508 4.12952 16.4063 4.0384 16.4441C3.94728 16.4819 3.8496 16.5013 3.75095 16.5013C3.6523 16.5013 3.55461 16.4819 3.4635 16.4441C3.37238 16.4063 3.28958 16.3502 3.21991 16.2803L0.219947 13.281C0.0791174 13.1402 -4.69245e-09 12.9492 0 12.75C4.69246e-09 12.5508 0.0791174 12.3598 0.219947 12.219C0.360777 12.0782 0.551784 11.9991 0.750947 11.9991C0.950111 11.9991 1.14112 12.0782 1.28195 12.219L3.75095 14.6895L6.21995 12.219C6.28961 12.1492 6.37238 12.0937 6.4635 12.0559C6.55461 12.0181 6.6523 11.9987 6.75095 11.9987C6.8496 11.9987 6.94728 12.0181 7.0384 12.0559C7.12952 12.0937 7.21228 12.1492 7.28195 12.219ZM9.75095 11.25C9.75095 11.0511 9.82996 10.8603 9.97062 10.7197C10.1113 10.579 10.302 10.5 10.5009 10.5H15.0009C15.1999 10.5 15.3906 10.579 15.5313 10.7197C15.6719 10.8603 15.7509 11.0511 15.7509 11.25C15.7509 11.4489 15.6719 11.6397 15.5313 11.7803C15.3906 11.921 15.1999 12 15.0009 12H10.5009C10.302 12 10.1113 11.921 9.97062 11.7803C9.82996 11.6397 9.75095 11.4489 9.75095 11.25ZM9.75095 6.75C9.75095 6.55109 9.82996 6.36032 9.97062 6.21967C10.1113 6.07902 10.302 6 10.5009 6H18.0009C18.1999 6 18.3906 6.07902 18.5313 6.21967C18.6719 6.36032 18.7509 6.55109 18.7509 6.75C18.7509 6.94891 18.6719 7.13968 18.5313 7.28033C18.3906 7.42098 18.1999 7.5 18.0009 7.5H10.5009C10.302 7.5 10.1113 7.42098 9.97062 7.28033C9.82996 7.13968 9.75095 6.94891 9.75095 6.75ZM9.75095 2.25C9.75095 2.05109 9.82996 1.86032 9.97062 1.71967C10.1113 1.57902 10.302 1.5 10.5009 1.5H21.0009C21.1999 1.5 21.3906 1.57902 21.5313 1.71967C21.6719 1.86032 21.7509 2.05109 21.7509 2.25C21.7509 2.44891 21.6719 2.63968 21.5313 2.78033C21.3906 2.92098 21.1999 3 21.0009 3H10.5009C10.302 3 10.1113 2.92098 9.97062 2.78033C9.82996 2.63968 9.75095 2.44891 9.75095 2.25ZM9.75095 15.75C9.75095 15.5511 9.82996 15.3603 9.97062 15.2197C10.1113 15.079 10.302 15 10.5009 15H12.0009C12.1999 15 12.3906 15.079 12.5313 15.2197C12.6719 15.3603 12.7509 15.5511 12.7509 15.75C12.7509 15.9489 12.6719 16.1397 12.5313 16.2803C12.3906 16.421 12.1999 16.5 12.0009 16.5H10.5009C10.302 16.5 10.1113 16.421 9.97062 16.2803C9.82996 16.1397 9.75095 15.9489 9.75095 15.75Z"
              fill="#EAEAEA"/>
      </svg>
    </div>
  );
};


export default function CatalogPage() {
  const [isOpenProduct, setIsOpenProduct] = useState<boolean>(false);
  const [globalCurrentProductId, setGlobalCurrentProductId] = useState<string>('');
  const [globalCurrentProductType, setGlobalCurrentProductType] = useState<ProductType | null>(null);

  const {coreOptions,
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
    flRefetch
  } = FiltersCatalog()

  const router = useRouter();

  useEffect(()=> {
    if (userStore.role !== 'admin') {
      router.push('/')
    }
  }, [])

  return (
    <>
      <Paper
        bg={'#EEEEEE'}
        radius={'xl'}
        pos={'relative'}
        mt={50}
        style={{minHeight: '92vh', display: 'flex', flexDirection: 'column', alignItems: 'center'}}
      >

        <div style={{
          position: 'absolute',
          top: 15,
          left: 25,
          width: 10,
          height: 10,
          backgroundColor: 'black',
          borderRadius: '50%',
        }}/>

        <div style={{
          position: 'absolute',
          top: 15,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60px',
          height: 10,
          backgroundColor: 'black',
          borderRadius: 5,
        }}/>

        <div style={{
          position: 'absolute',
          top: 15,
          right: 25,
          width: 10,
          height: 10,
          backgroundColor: 'black',
          borderRadius: '50%',
        }}/>

        <Group w={'100%'} justify={'flex-end'} mt={10} px={50}>
          <Button onClick={() => router.push("products/create-product")}>Создать новый товар</Button>
          <Button onClick={() => router.push("/admin")}>Вернуться назад</Button>

        </Group>

        <Title id={'catalog'} c={'#000'} fw={500} fz={38} mt={30}>
          Каталог товаров (Админ панель)
        </Title>

        <Paper mt={30} px={35} w={'100%'} bg={'transparent'}
               style={{display: 'flex', flexDirection: 'column', justifyContent: 'start'}}>
          <Stack>
            <Group>
              <Paper h={48} radius={16} p={10} bg={'#262626'}>
                <Text fz={18} fw={500}>
                  Фильтр:
                </Text>
              </Paper>
              <Button
                h={48} radius={16} p={10}
                bg={productTypes.includes('processors') ? '#0D6EFD' : '#262626'}
                onClick={() => handleProductTypesChange('processors')}
              >
                <Text fz={18} fw={500}>Процессоры</Text>
              </Button>

              <Button
                h={48} radius={16} p={10}
                bg={productTypes.includes('flash-drivers') ? '#0D6EFD' : '#262626'}
                onClick={() => handleProductTypesChange('flash-drivers')}
              >
                <Text fz={18} fw={500}>Флешки</Text>
              </Button>


              <Button onClick={handlePriceSort} h={48} radius={16} p={10} bg={priceAsc ? '#0D6EFD' : '#262626'} rightSection={<Price rotate={priceAsc ? 180 : 0}/>}>
                <Text fz={18} fw={500}>
                  Цена
                </Text>
              </Button>
            </Group>

            <Group>
              <Paper h={48} radius={16} p={10} bg={'#262626'}>
                <Text fz={18} fw={500}>
                  Процессоры:
                </Text>
              </Paper>
              <MultiSelectCustom
                data={frequencyOptions}
                onChange={handleFrequencyChange}
                value={selectFrequency}
                placeholder={'Частота'}
              />
              <MultiSelectCustom
                data={coreOptions}
                onChange={handleCoresChange}
                value={selectedCores}
                placeholder={'Количество ядер'}
              />
              <Button
                onClick={() => handleBrandsChange(brands, 'Intel')}
                h={48} radius={16} p={10}
                bg={brands.includes('Intel') ? '#0D6EFD' : '#262626'}
              >
                <Text fz={18} fw={500}>Intel</Text>
              </Button>

              <Button
                onClick={() => handleBrandsChange(brands, 'Ryzen')}
                h={48} radius={16} p={10}
                bg={brands.includes('Ryzen') ? '#0D6EFD' : '#262626'}
              >
                <Text fz={18} fw={500}>Ryzen</Text>
              </Button>
            </Group>

            <Group>
              <Paper h={48} radius={16} p={10} bg={'#262626'}>
                <Text fz={18} fw={500}>
                  Флешки:
                </Text>
              </Paper>
              <MultiSelectCustom
                data={dataVolumeOptions}
                onChange={handleDataVolumeChange}
                value={selectDataVolume}
                placeholder={'Объём памяти'}
              />
              <MultiSelectCustom
                data={interfaceOptions}
                onChange={handleInterfaceChange}
                value={selectInterface}
                placeholder={'Интерфейс'}
              />
            </Group>
          </Stack>
        </Paper>
        <Box
          display="grid"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, 320px)',
            gap: '20px',
            width: '100%',
          }}
          px={35}
          mt={50}
        >
          {isLoading ? <Loader/> :
            (processors && processors.slice(0, limit).map((item: ProductForCatalog) => (
                <AdminCartCatalog
                  key={item.id}
                  id={item.id}
                  productType={ProductType.Processor}
                  image_url={ReformatImageUrlLink(item.image_url)}
                  name={item.name}
                  retail_price={item.retail_price}
                  wholesale_price={item.wholesale_price}
                  procRefetch={procRefetch}
                />
              ))

            )
          }
          {!flLoading && productTypes.includes('flash-drivers') && flashs && flashs.slice(0, limit - (processors ? processors.length : 0)).map((item: ProductForCatalog) => (
            <AdminCartCatalog
              key={item.id}
              id={item.id}
              productType={ProductType.FlashDriver} // обязательно укажи правильный тип
              image_url={ReformatImageUrlLink(item.image_url)}
              name={item.name}
              retail_price={item.retail_price}
              wholesale_price={item.wholesale_price}
              procRefetch={flRefetch}
            />
          ))}

        </Box>
        <Button
          size={'md'}
          mt={20}
          mb={30}
          fw={500}
          fz={18}
          radius={8}
          c={'#262626'}
          bg={'transparent'}
          style={{border: '1px solid #262626'}}
          onClick={() => setLimit(prevState => prevState + 20)}
        >
          Показать ещё
        </Button>


      </Paper>
    </>
  )
}
