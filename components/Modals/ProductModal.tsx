import {Button, Divider, Grid, Group, Image, Modal, Stack, Text} from "@mantine/core";
import {FlashDriveWithImagesDTO, ProcessorWithImagesDTO, ProductType} from "@/types";
import {useQuery} from "@tanstack/react-query";
import api from "@/api/axios";
import {ReformatImageUrlLink} from "@/utils/reformatImageUrlLink";
import {useEffect, useState} from "react";
import {formatWithDot} from "@/utils/formatWithDot";
import IntelLogo from "@/public/images/intel.logo";
import RyzenLogo from "@/public/images/ryzen.logo";
import {cartStore} from "@/stores/cartStore";

interface ProductModalProps {
  productType: ProductType | null,
  productId: string,
  isModalOpen: boolean,
  setModalOpen: (isOpen: boolean) => void,
}

const Characterize = ({name, value}: {name: string, value: string | number | boolean}) => {
  return (<Group wrap="nowrap" style={{ width: '100%', alignItems: 'flex-end' }}>
    <Text c="#7B7B7B" fz={12} fw={500} style={{ flexShrink: 0 }}>
      {name}
    </Text>

    <div style={{
      flex: 1,
      borderBottom: '1px dashed #7B7B7B',
      margin: 0,
    }} />

    <Text c="black" fz={12} fw={500} style={{ flexShrink: 0 }}>
      {value ? value : "Неизвестно"}
    </Text>
  </Group>)
}

export type ProductDTO =
  | (ProcessorWithImagesDTO & { type: ProductType.Processor })
  | (FlashDriveWithImagesDTO & { type: ProductType.FlashDriver });

export default function ProductModal({productType, productId, setModalOpen, isModalOpen}: ProductModalProps) {

  const { data: product, isLoading, error } = useQuery<ProductDTO>({
    queryKey: ['product', productType, productId],
    queryFn: async () => {
      if (productType === ProductType.Processor) {
        const { data } = await api.get(`/processor/${productId}`);
        return { ...data.processor, type: ProductType.Processor };
      } else if (productType === ProductType.FlashDriver) {
        const { data } = await api.get(`/flash-driver/${productId}`);
        return { ...data.flash_drive, type: ProductType.FlashDriver };
      }
      throw new Error('Unknown product type');
    },
    enabled: !!productType && !!productId,
  });

  const AddSoloItem = async () => {
    await cartStore.addItem(productId, productType!, 1)
  }

  const AddOptItems = async () => {
    // Находим товар в корзине
    if (product) {
      const existingItem = cartStore.items.find(i => i.product_id === productId);

      // Определяем минимальное количество для опта
      const minQty = product.wholesale_min_qty;

      // Новое количество
      if (existingItem) {
          await cartStore.addItem(productId, productType!, minQty-existingItem.quantity);
      } else await cartStore.addItem(productId, productType!, minQty)

      // Добавляем/обновляем в корзине

    }
  }

  const [currentImageUrl, setCurrentImageUrl] = useState<string>()

  useEffect(() => {
    if (product) setCurrentImageUrl(product.image_urls[0])
  }, [product, isLoading]);

  return (
    (!isLoading && product && isModalOpen &&
      <Modal
        opened={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={product.name}
        centered
        overlayProps={{
          blur: 3
        }}
        size={'xl'}
        c={'black'}
        radius={30}
        styles={{
          header: {
            backgroundColor: '#eee',
            display: 'flex',          // нужен flex
            justifyContent: 'center', // центрируем контент
          },
          title: {
            fontFamily: 'var(--font-inter)',
            fontWeight: 700,
            fontSize: 30,
            marginLeft: 'auto',
            // marginTop: 20// убираем лишние маргины
          },
          body: {
            padding: '20px',          // паддинг для контента
            backgroundColor: '#eee',
            zIndex: 99,
            overflowX: "hidden"
          },
          close: {
            color: 'black', // меняем цвет крестика
          },
        }}
      >
        <Stack>
          <Group align="flex-start" gap="md" style={{ width: '100%' }}>
            {/* Колонка миниатюр */}
            <Stack gap={8} style={{ flexShrink: 0 }}>
              {product.image_urls.map(url => (
                <Image
                  key={url}
                  onClick={() => setCurrentImageUrl(url)}
                  radius={6}
                  w={61}
                  h={60}
                  src={ReformatImageUrlLink(url)}
                  alt={product.name}
                  style={{ border: currentImageUrl === url ? "1.5px solid #0D6EFD" : "" }}
                />
              ))}
            </Stack>

            {/* Большое изображение */}
            <Image
              radius={20}
              w={306}
              h={317}
              src={ReformatImageUrlLink(currentImageUrl)}
              alt={product.name}
              style={{ flexShrink: 0 }}
            />

            {/* Информационный блок */}
            <Stack gap="sm" style={{ flex: 1, minWidth: 200 }}>
              <Text fw={600} fz={18} c={'#000'}>О товаре</Text>

              <Group align="center" gap="sm" mt={-10}>
                {productType === ProductType.Processor && (product.brand === 'Intel' ? <IntelLogo/> : <RyzenLogo/>)}
                <Stack gap={0}>
                  <Text fw={500} fz={12}>{product.brand}</Text>
                  <Text c="#7B7B7B" fw={500} fz={12}>
                    Бренд
                    <svg
                      width="3"
                      height="3"
                      viewBox="0 0 3 3"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ verticalAlign: 'middle', margin: '0 2px' }}
                    >
                      <circle cx="1.5" cy="1.5" r="1.5" fill="#7B7B7B" />
                    </svg>
                    Оригинал
                  </Text>
                </Stack>
                <Text ml={'auto'} c={'#7B7B7B'} fz={12} fw={500}>{product.count_orders} {product.count_orders === 1 ? "заказ" : product.count_orders <= 4 ? "заказа" : "заказов"}</Text>
              </Group>


              <Group gap="md" align="flex-start" wrap={'nowrap'}>
                <Text c="#7B7B7B" fz={12} fw={500} w={161.5}>Артикул</Text>
                <Text c="black" fz={12} fw={500}>{product.sku}</Text>
              </Group>
              <Divider mt={-10} style={{ flex: 1, borderColor: '#7B7B7B' }}/>
              <Group gap="md" align="flex-start" wrap={'nowrap'}>
                <Text c="#7B7B7B" fz={12} fw={500} w={161.5}>Тип</Text>
                <Text c="black" fz={12} fw={500}>{product.type === ProductType.Processor ? "Процессор" : "Флешка"}</Text>
              </Group>
              <Divider mt={-10} style={{ flex: 1, borderColor: '#7B7B7B' }}/>
              {product.type === ProductType.Processor && (
                <>
                  <Group gap="md" align="flex-start" wrap={'nowrap'}>
                    <Text c="#7B7B7B" fz={12} fw={500} w={161.5}>Линейка процессора</Text>
                    <Text c="black" fz={12} fw={500}>{product.line}</Text>
                  </Group>
                  <Divider mt={-10} style={{ flex: 1, borderColor: '#7B7B7B' }}/>

                  <Group gap="md" align="flex-start" wrap={'nowrap'}>
                    <Text c="#7B7B7B" fz={12} fw={500} w={161.5}>Архитектура</Text>
                    <Text c="black" fz={12} fw={500}>{product.architecture}</Text>
                  </Group>
                  <Divider mt={-10} style={{ flex: 1, borderColor: '#7B7B7B' }}/>

                  <Group gap="md" align="flex-start" wrap={'nowrap'}>
                    <Text c="#7B7B7B" fz={12} fw={500} w={161.5}>Сокет процессора</Text>
                    <Text c="black" fz={12} fw={500}>{product.socket}</Text>
                  </Group>
                  <Divider mt={-10} style={{ flex: 1, borderColor: '#7B7B7B' }}/>

                  <Group gap="md" align="flex-start" wrap={'nowrap'}>
                    <Text c="#7B7B7B" fz={12} fw={500} w={161.5}>Базовая частота, ГГц</Text>
                    <Text c="black" fz={12} fw={500}>{product.base_frequency}</Text>
                  </Group>
                </>
              )}
              {product.type === ProductType.FlashDriver && (
                <>

                  <Group gap="md" align="flex-start" wrap="nowrap">
                    <Text c="#7B7B7B" fz={12} fw={500} w={161.5}>Объем памяти</Text>
                    <Text c="black" fz={12} fw={500}>{product.capacity_gb} ГБ</Text>
                  </Group>
                  <Divider mt={-10} style={{ flex: 1, borderColor: '#7B7B7B' }} />

                  <Group gap="md" align="flex-start" wrap="nowrap">
                    <Text c="#7B7B7B" fz={12} fw={500} w={161.5}>Интерфейс</Text>
                    <Text c="black" fz={12} fw={500}>{product.usb_interface}</Text>
                  </Group>
                </>
              )}


              <Group mt={'0'}>
                <Button onClick={AddSoloItem} bg={'#262626'} h={40} px={15} size={'xs'}>
                  <Stack gap={-15}>
                    <Text c={'#8A8A8A'} fz={12} fw={500}>
                      Розница
                    </Text>
                    <Text c={'#EEEEEE'} fz={12} fw={500}>
                      {formatWithDot(product.retail_price)}р.
                    </Text>
                  </Stack>
                </Button>

                <Button onClick={AddOptItems} bg={'#262626'} h={40} px={15} size={'xs'}>
                  <Stack gap={-15}>
                    <Text c={'#8A8A8A'} fz={12} fw={500}>
                      Опт от {product.wholesale_min_qty}шт.
                    </Text>
                    <Text c={'#EEEEEE'} fz={12} fw={500}>
                      {formatWithDot(product.wholesale_price)}р.
                    </Text>
                  </Stack>
                </Button>
              </Group>
            </Stack>
          </Group>

          <Text fw={600} fz={18} c={'black'}>Характеристики</Text>
          {product.type === ProductType.Processor &&
            <Grid w={730} gutter={30}>

              {/* Левая колонка */}
              <Grid.Col span={6}>
                <Stack gap={10}>
                  <Characterize name="Артикул" value={product.sku} />
                  <Characterize name="Тип" value="Процессор" />
                  <Characterize name="Линейка процессора" value={product.line} />
                  <Characterize name="Архитектура" value={product.architecture} />
                  <Characterize name="Сокет процессора" value={product.socket} />
                  <Characterize name="Базовая частота, ГГц" value={product.base_frequency} />
                  <Characterize name="Турбо-частота, ГГц" value={product.turbo_frequency} />
                  <Characterize name="Количество ядер" value={product.cores} />
                  <Characterize name="Количество потоков" value={product.threads} />
                  <Characterize name="Кэш L3, МБ" value={product.l3_cache} />
                  <Characterize name="Техпроцесс" value={product.lithography} />
                  <Characterize name="Тепловыделение, Вт" value={product.tdp} />
                </Stack>
              </Grid.Col>

              {/* Правая колонка */}
              <Grid.Col span={6}>
                <Stack gap={10}>
                  <Characterize name="Особенности" value={product.features} />
                  <Characterize name="Тип памяти" value={product.memory_type} />
                  <Characterize name="Кэш L1, КБ" value={product.l1_cache} />
                  <Characterize name="Кэш L2, КБ" value={product.l2_cache} />
                  <Characterize name="Макс. объем ОЗУ" value={product.max_ram} />
                  <Characterize name="Макс. частота оперативной памяти, МГц" value={product.max_ram_frequency} />
                  <Characterize name="Наличие встроенной графики" value={product.integrated_graphics ? "Да" : "Нет"} />
                  <Characterize name="Встроенная графика" value={product.graphics_model} />
                  <Characterize name="Макс. раб. темп. процессора, °C" value={product.max_temperature} />
                  <Characterize name="Комплектация процессора" value={product.package_contents} />
                  <Characterize name="Страна-изготовитель" value={product.country_of_origin} />
                  <Characterize name="Бренд" value={product.brand} />
                </Stack>
              </Grid.Col>

            </Grid>

          }

          {product.type === ProductType.FlashDriver && (
            <Grid gutter={20} w={730}>

              {/* Левая колонка */}
              <Grid.Col span={6}>
                <Stack gap={10}>
                  <Characterize name="Артикул" value={product.sku} />
                  <Characterize name="Бренд" value={product.brand} />
                  <Characterize name="Тип" value="Флеш-накопитель" />
                  <Characterize name="Объем памяти (ГБ)" value={product.capacity_gb} />
                  <Characterize name="USB-интерфейс" value={product.usb_interface} />
                  <Characterize name="Форм-фактор" value={product.form_factor} />
                  <Characterize name="Скорость чтения (МБ/с)" value={product.read_speed} />
                  <Characterize name="Скорость записи (МБ/с)" value={product.write_speed} />
                  <Characterize name="Тип чипа" value={product.chip_type} />
                  <Characterize name="OTG-поддержка" value={product.otg_support ? "Да" : "Нет"} />
                  <Characterize name="Материал корпуса" value={product.body_material} />
                  <Characterize name="Цвет" value={product.color} />
                  <Characterize name="Водозащита" value={product.water_resistance ? "Да" : "Нет"} />
                  <Characterize name="Пылезащита" value={product.dust_resistance ? "Да" : "Нет"} />
                  <Characterize name="Ударопрочность" value={product.shockproof ? "Да" : "Нет"} />
                </Stack>
              </Grid.Col>

              {/* Правая колонка */}
              <Grid.Col span={6}>
                <Stack gap={10}>
                  <Characterize name="Длина (мм)" value={product.length_mm} />
                  <Characterize name="Ширина (мм)" value={product.width_mm} />
                  <Characterize name="Толщина (мм)" value={product.thickness_mm} />
                  <Characterize name="Вес (г)" value={product.weight_g} />

                  <Characterize name="Совместимость" value={product.compatibility} />
                  <Characterize name="Рабочая температура" value={product.operating_temp} />
                  <Characterize name="Температура хранения" value={product.storage_temp} />
                  <Characterize name="Страна происхождения" value={product.country_of_origin} />
                  <Characterize name="Комплектация" value={product.package_contents} />
                  <Characterize name="Гарантия (мес.)" value={product.warranty_months} />
                  <Characterize name="Особенности" value={product.features} />

                  <Characterize name="Оптовая цена" value={product.wholesale_price} />
                  <Characterize name="Минимальный опт (шт.)" value={product.wholesale_min_qty} />
                  <Characterize name="Остаток на складе" value={product.stock} />
                  <Characterize name="Тип колпачка" value={product.cap_type} />
                </Stack>
              </Grid.Col>

            </Grid>
          )}


        </Stack>

      </Modal>
    ))
}
