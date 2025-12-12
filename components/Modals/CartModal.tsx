'use client'
import {Box, Button, Group, Modal, Image, Stack, Text, NumberInput, SimpleGrid, Grid, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import {useEffect, useState } from "react";
import {cartStore} from "@/stores/cartStore";
import { observer } from "mobx-react-lite";
import {Counter} from "@/components/Counter/Counter";
import {formatWithDot} from "@/utils/formatWithDot";
import {CartProduct, User} from "@/types";
import {CreditCard, Cross, MapPin, ShoppingCart } from "lucide-react";
import {fetchProfile} from "@/api/profile";
import { useQuery } from "@tanstack/react-query";


const CartCard = ({id, name, image_url, price, product_id, quantity}: CartProduct) => {
  return (
    <Box
      w="100%"
      style={{ border: '1px solid #7B7B7B', borderRadius: 8 }}
      p={10}
    >
      <Group align="center" justify="space-between" wrap="nowrap">
        {/* Левая часть */}

          <Image src={image_url} alt={product_id} w={61} h={60} radius={6} />

          <Stack gap={0}>
            <Text fw={500} fz={18} c={'#000000'}>{name}</Text>
            <Text ta={'center'} fw={500} fz={12} c={'#0D6EFD'}>{formatWithDot(price)}p.</Text>
          </Stack>


        {/* Правая часть */}
        <Group gap={10} wrap="nowrap">
          <Text fw={500} fz={18} c={'#000000'}>{formatWithDot(quantity * price)}p.</Text>

          <Counter
            value={quantity}
            onChange={(newValue) => cartStore.changeQuantity(id, newValue)}
          />
        </Group>
      </Group>
    </Box>
  )
}

const ProductLabel = ({name, price, quantity}: {name: string, price: number, quantity: number}) => {
  return (<Group wrap="nowrap" style={{ width: '100%', alignItems: 'flex-end' }}>
    <Text c="#7B7B7B" fz={12} fw={500} style={{ flexShrink: 0 }}>
      {name}
    </Text>

    <div style={{
      flex: 1,
      borderBottom: '1px dashed #7B7B7B',
      margin: 0,
    }} />

    <Group style={{ flexShrink: 0 }}>
      <Text c="black" fz={12} fw={500} mr={-10}>
        {quantity}шт.
      </Text>
      <Cross width={8} height={8} fill={'#0D6EFD'} color={'#0D6EFD'} style={{transform: 'rotate(45deg)'}}/>
      <Text c="black" fz={12} fw={500} ml={-10}>
        {price}p.
      </Text>
    </Group>
  </Group>)
}

export const CartModal = observer(() => {
  const [isPay, setIsPay] = useState<boolean>(false)

  const router = useRouter()

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['userProfile'],
    queryFn: fetchProfile,
  });

  useEffect(() => {
    const run = async () => {
      await cartStore.fetchCart()
    }
    run()

  }, [cartStore.isOpenCart]);

  const GoToPay = () => {
    setIsPay(prevState => !prevState)
  }

  return (
    cartStore.isOpenCart && <Modal
      opened={cartStore.isOpenCart}
      onClose={
      () => {
        if (isPay) {
          setIsPay(false)
        } else cartStore.setIsOpenCart(false)
      }}
      title={isPay ? "Оформление заказа" : "Корзина"}
      centered
      overlayProps={{
        blur: 3
      }}
      size={isPay ? 'md' : 'xl'}
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
          zIndex: 99
        },
        close: {
          color: 'black', // меняем цвет крестика
        },
      }}
    >

      {!isPay ? <Stack>
        {
          cartStore.items.map((item) => (
            <CartCard key={item.id} id={item.id} product_id={item.product_id} quantity={item.quantity}
                      image_url={item.image_url} price={item.price} name={item.name}/>
          ))
        }
        <Text fz={36} fw={500} c={'black'} mt={-15} mb={-10}>
          Самовывоз
        </Text>
        <Grid gutter={20}>
          <Grid.Col span={6}>
            <iframe
              style={{borderRadius: 8, width: '100%', height: 257}}
              src="https://yandex.ru/map-widget/v1/?um=constructor%3Aa5550715c321513a427c990d551755c5adfcba6b04f609510a0af8301d44e9ff&source=constructor"
              frameBorder="0"
            />
            <Stack>
              <Text c={'black'} fz={18} fw={600}>
                Адрес
              </Text>
              <Text c={'#7B7B7B'} fz={18} fw={500} mt={-10}>
                Лобачевского 44 г. Москва
              </Text>
            </Stack>
          </Grid.Col>

          <Grid.Col span={6} style={{display: 'flex', flexDirection: 'column'}}>
            <Text fz={12} fw={500} c="#7B7B7B" mb={10}>
              На данный момент мы работаем в режиме самовывоза. Это позволяет нам тщательнее контролировать качество и
              передавать вам заказы максимально быстро. Не беспокойтесь о статусе заказа — как только он будет собран,
              мы сразу свяжемся с вами по телефону и продублируем информацию по электронной почте.
            </Text>
            {
              cartStore.items.map(item => <ProductLabel key={item.id + item.product_id} name={item.name}
                                                        price={item.price} quantity={item.quantity}/>)
            }
            <Group justify={'space-between'} mt={25}>
              <Text fz={18} fw={600} c={'black'}>
                Итог:
              </Text>
              <Text fz={18} fw={600} c={'#0D6EFD'}>
                {cartStore.totalPrice}p.
              </Text>
            </Group>
            <Button onClick={GoToPay} disabled={cartStore.items.length === 0} w={165} m={'auto auto 0 auto'}
                    bg={'#262626'} c={'#EEEEEE'} radius={8}>Оплатить</Button>
          </Grid.Col>
        </Grid>
      </Stack>
      :
        <Stack>
          <Text mt={-20} ta={'center'} fw={400} fz={20} c={'#ADB5BD'}>{cartStore.items.length} {cartStore.items.length === 1 ? "товар" : cartStore.items.length <= 4 ? "товара" : "товаров"}</Text>
          <Text fw={600} fz={20} c={'black'}>Личные данные</Text>
          {!isLoading && user &&
            <>
              <TextInput
                readOnly
                value={user.Name}
                styles={{
                  input: {
                    color: '#ADB5BD',
                    backgroundColor: 'transparent',
                    borderRadius: 6,
                  }
                }}
              />
              <TextInput
                readOnly
                value={user.Number}
                styles={{
                  input: {
                    color: '#ADB5BD',
                    backgroundColor: 'transparent',
                    borderRadius: 6,
                  }
                }}
              />
              <TextInput
                readOnly
                value={user.Email}
                styles={{
                  input: {
                    color: '#ADB5BD',
                    backgroundColor: 'transparent',
                    borderRadius: 6,
                  }
                }}
              />
            </>
          }
          <Text fw={600} fz={20} c={'black'}>Оплата</Text>

          <Button
            bg={'transparent'}
            leftSection={<CreditCard size={44} color={'black'} style={{marginRight: 10}}/>}
            h={95}
            justify={'flex-start'}
            radius={10}
            style={{
              boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.25)',
            }}
            onClick={() => {
              setIsPay(false)
              cartStore.setIsOpenCart(false)
              router.push('payment?method=card')
            }}
          >
            <Stack align={'flex-start'} gap={0}>
              <Text fw={400} fz={20} c={'black'}>Банковская карта</Text>
              <Text fw={400} fz={20} c={'#ADB5BD'}>МИР, Visa, Mastercard</Text>
            </Stack>
          </Button>

          <Button
            bg={'transparent'}
            leftSection={<Box size={44} color={'black'} style={{marginRight: 10}}><svg width="92" height="95" viewBox="0 0 92 95" fill="none" xmlns="http://www.w3.org/2000/svg" href="http://www.w3.org/1999/xlink">
              <rect width="92" height="95" fill="url(#pattern0_190_1005)"/>
              <defs>
                <pattern id="pattern0_190_1005" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <use href="#image0_190_1005" transform="matrix(0.00277583 0 0 0.00268817 -0.00103728 0)"/>
                </pattern>
                <image id="image0_190_1005" width="361" height="372" preserveAspectRatio="none" href="data:image/png;base64,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cVGkl4ueXITxYODIQP+7z/zvgaUzXm86uOcyAJqyrOMHJdIKp2Et/9mWYLe2pIlorcUJsd03oj6k24MzeHKpKL4UTjB7CWunl7CnhFD3i4wA4dRooNji9449uPzql6rXLVrR4j94SvtvqCxtt6BEWuEUOltkudvqQzg3FhZThlgaA0TaN911jHA9imByw7YN8/S61TcASA/7CmVpuwbHz05F3GEV4R5VGsNnTSJffKmHMBYWW/zeodXr7nnQu/zqV4J+73ejPTBF7xFzs1TherpVYKnjvZox09L1IbMQY+YgkL5qESXCAZDGg3sm7L9/WkntpqfvCwYaBgMhiS+KmCdm5qcibuhs8YouQ0BsHVxkYwAW4QiP44JTiKrVmlxYZOA0079p5W+8y655s6Fsw08JNL11V3tufUWsoERaER/oBZgI58YtCEWfkxJjwSdtw5oSo/+XLpCTq9cveqJ63aK/Bv3eMcbTahExpomt2amIB3pvxcuSfSj90zQZ8OTF0GHQuiiUUGI9CoRyShu2bfiR3rrrTwD6qUXE2CaGZqciTugVs0+WLeXW3etNAvqExk3HAuGsf9FigOutuwb4N638fweWzihpOrhnMtSxHrOoH07hNKwLhz1mAtpipi3/OSEgiRR9QhcRLX5qRx0kbSTCWO6bLhBOeYvfe97B5Ve/Ur1u0ZPNtd72Y6slVveIcpVEHUfNP4UihIgphCxlakizpaNKTC0smliTgpIaykqvrnrqV282lG24BUbrrjawukeUqyTqKJFWOI322mf1mmjbSpkSZhwYkaw53QuYVjVhvNnvK6xed8+SA0tnvB70eydEe3CKzhGzs0/hWtoz3XrVrDMaA8hMRMIAd8QcW9PLeUttxXf3L53xas2Ghx8JBhqGtNpauTgchRJphdNor55076kHoSCJevEls8O3KHoUm+6OcIjvlFMGoE/dB2t/qcdWXw0gxdhKuTgchRJphQIwak97cikS07VwC3LuQFTXozBjq0+qXr/oqep1i14O+r1jje2UNe0YXDT7FC7BuuAV4Te2FF+SiFTsSA+l95CfR4g1ADBwShrKSifp6eULAeQqa9o5KJFWOI2omHAExIihluniVreHK5ALouZiqLCqCeMQgS0D/e8+8/sDS2dsPLbzwynu+eCxjfoRFE4jqiac7C4uS5kahFjTtI37jqbtWtam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"/>
              </defs>
            </svg>
            </Box>}
            h={95}
            justify={'center'}
            radius={10}
            style={{
              boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.25)',
            }}
            onClick={() =>
            {
              setIsPay(false)
              cartStore.setIsOpenCart(false)
              router.push('payment?method=sbp')
            }}
          >

              <Text fw={400} fz={42} c={'black'}>СБП</Text>

          </Button>

          <Text fw={600} fz={20} c={'black'}>Детали заказа</Text>
          <Text fw={600} c={'#7B7B7B'} fz={18}>Заказ будет ожидать вас по адресу Лобачевского 44, г. Москва; отследить заказ можно будет в личном кабинете после оплаты, так же по готовности вам придет уведомление на телефон и почту</Text>
        </Stack>
      }

    </Modal>
  )
})
