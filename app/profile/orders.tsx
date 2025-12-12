import {OrderItem, OrdersResponse, OrderStatus} from "@/types";
import {Box, Button, Collapse, Divider, Group, Paper, Stack, Text, Title} from "@mantine/core";
import {Box as BoxImage, CheckCircle, ChevronDown, ChevronUp, Clock, Cross, ShoppingBag} from "lucide-react";
import {formatWithDot} from "@/utils/formatWithDot";
import {useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "@/api/axios";
import api from "@/api/axios";

export default function OrdersPage() {

  const{ data } = useQuery<OrdersResponse>({
    queryKey: ["orders", "get-all-orders"],
    queryFn: async () => {
      const { data } = await api.get("/order/get-all-orders");
      return data;
    },
  });

  return (<Paper bg={'transparent'} mb={200} w={810} mt={10} withBorder p={10} styles={{
    root: {
      border: "2px solid #141414",
      borderRadius: 16
    }
  }}>
    <Group gap={10}>

      <Box w={255} bg={'#9EC5FE'} p={10} style={{borderRadius: 16}}>
        <Group>
          <Box bg={'#3D8BFD'} w={60} h={60} display={'flex'} style={{justifyContent: 'center', alignItems: 'center', borderRadius: 16}}>
            <ShoppingBag size={25} color={'#9EC5FE'}/>
          </Box>
          <Stack gap={0}>
            <Text c={'#262626'} fz={16}>Всего заказов</Text>
            <Text c={'#000'} fz={16}>{formatWithDot(data?.total_orders || 0)}</Text>
          </Stack>
        </Group>
      </Box>
      <Box w={255} bg={'#A3CFBB'} p={10} style={{borderRadius: 16}}>
        <Group>
          <Box bg={'#198754'} w={60} h={60} display={'flex'} style={{justifyContent: 'center', alignItems: 'center', borderRadius: 16}}>
            <BoxImage size={25} color={'#A3CFBB'}/>
          </Box>
          <Stack gap={0}>
            <Text c={'#262626'} fz={16}>Товаров куплено</Text>
            <Text c={'#000'} fz={16}>{formatWithDot(data?.total_items || 0)}</Text>
          </Stack>
        </Group>
      </Box>
      <Box w={255} bg={'#FECBA1'} p={10} style={{borderRadius: 16}}>
        <Group>
          <Box bg={'#FEB272'} w={60} h={60} display={'flex'} style={{justifyContent: 'center', alignItems: 'center', borderRadius: 16}}>
            <ShoppingBag size={25} color={'#FECBA1'}/>
          </Box>
          <Stack gap={0}>
            <Text c={'#262626'} fz={16}>На сумму</Text>
            <Text c={'#000'} fz={16}>{formatWithDot(data?.total_sum || 0)}</Text>
          </Stack>
        </Group>
      </Box>
    </Group>

    <Group gap={5} mb={10} mt={10}>
      <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13.1882 0.10024C13.0749 0.146944 12.935 0.273712 12.8817 0.380465C12.8284 0.480547 12.5087 1.54141 12.1689 2.73571C11.8292 3.93001 11.4361 5.19103 11.2896 5.53798C10.2637 8.0667 8.09861 10.2351 5.56716 11.2693C5.22075 11.4094 3.91505 11.8164 2.65598 12.1767C0.231108 12.8706 0.104536 12.9306 0.0112713 13.3443C-0.0486843 13.6179 0.137844 13.9782 0.397652 14.0983C0.517563 14.1516 1.58344 14.4719 2.77589 14.8122C3.96834 15.1524 5.22075 15.5461 5.56716 15.6862C8.10528 16.7271 10.257 18.8821 11.2896 21.4175C11.4361 21.7645 11.8292 23.0255 12.1689 24.2198C12.5087 25.4141 12.8284 26.4816 12.8817 26.6017C13.0016 26.8619 13.3614 27.0488 13.6345 26.9887C14.0475 26.8953 14.1075 26.7685 14.8003 24.3399C15.4931 21.9046 15.7729 21.124 16.2792 20.2366C17.3384 18.3817 19.0838 16.7671 20.9624 15.893C21.6686 15.5661 22.2548 15.3726 24.5797 14.7121C26.7515 14.0916 26.898 14.0249 26.9913 13.6112C27.0379 13.3843 26.8914 13.0174 26.6982 12.8973C26.6249 12.8506 25.6123 12.5437 24.4465 12.2101C21.5886 11.3894 21.0424 11.1826 20.0298 10.5621C18.0579 9.34107 16.539 7.57297 15.7063 5.53131C15.5664 5.18436 15.1734 3.93001 14.8336 2.73571C14.4939 1.54141 14.1741 0.480547 14.1208 0.380465C14.0342 0.200319 13.6811 -0.00651477 13.488 0.000157306C13.4413 0.00682938 13.3081 0.0468631 13.1882 0.10024Z"
          fill="#262626"/>
        <path
          d="M22.4192 1.02599C22.3898 1.0381 22.3535 1.07096 22.3397 1.09864C22.3259 1.12459 22.243 1.39962 22.1549 1.70926C22.0668 2.01889 21.9649 2.34582 21.9269 2.43577C21.661 3.09137 21.0996 3.65355 20.4433 3.92167C20.3535 3.958 20.015 4.06351 19.6886 4.15692C19.0599 4.33682 19.0271 4.35239 19.0029 4.45964C18.9874 4.53056 19.0357 4.62397 19.1031 4.6551C19.1342 4.66894 19.4105 4.75197 19.7197 4.84019C20.0288 4.92841 20.3535 5.03047 20.4433 5.0668C21.1014 5.33665 21.6592 5.89537 21.9269 6.55269C21.9649 6.64264 22.0668 6.96957 22.1549 7.27921C22.243 7.58884 22.3259 7.86561 22.3397 7.89675C22.3708 7.96421 22.4641 8.01264 22.5349 7.99707C22.642 7.97286 22.6575 7.93999 22.8371 7.31034C23.0167 6.67897 23.0893 6.47658 23.2205 6.24652C23.4952 5.76563 23.9477 5.34702 24.4347 5.12042C24.6178 5.03566 24.7698 4.9855 25.3725 4.81425C25.9356 4.65337 25.9736 4.63608 25.9977 4.52883C26.0098 4.47002 25.9718 4.37488 25.9217 4.34374C25.9028 4.33163 25.6402 4.25206 25.338 4.16557C24.5971 3.95281 24.4554 3.89918 24.1929 3.73831C23.6817 3.42176 23.2879 2.96336 23.072 2.43404C23.0357 2.34409 22.9338 2.01889 22.8458 1.70926C22.7577 1.39962 22.6748 1.12459 22.661 1.09864C22.6385 1.05194 22.547 0.998312 22.4969 1.00004C22.4848 1.00177 22.4502 1.01215 22.4192 1.02599Z"
          fill="#262626"/>
        <path
          d="M3.19803 16.5167C3.17915 16.5245 3.15584 16.5456 3.14696 16.5634C3.13807 16.5801 3.08478 16.7569 3.02816 16.956C2.97153 17.155 2.90602 17.3652 2.8816 17.423C2.71061 17.8445 2.34977 18.2059 1.92786 18.3782C1.87012 18.4016 1.65251 18.4694 1.44266 18.5295C1.03852 18.6451 1.01742 18.6551 1.00188 18.7241C0.991886 18.7696 1.02297 18.8297 1.06628 18.8497C1.08626 18.8586 1.26391 18.912 1.46265 18.9687C1.66139 19.0254 1.87012 19.091 1.92786 19.1144C2.35088 19.2878 2.7095 19.647 2.8816 20.0696C2.90602 20.1274 2.97153 20.3376 3.02816 20.5366C3.08478 20.7357 3.13807 20.9136 3.14696 20.9336C3.16694 20.977 3.2269 21.0081 3.27242 20.9981C3.34126 20.9826 3.35125 20.9614 3.46672 20.5567C3.58219 20.1508 3.62882 20.0207 3.7132 19.8728C3.88974 19.5636 4.18063 19.2945 4.49374 19.1488C4.61143 19.0944 4.70913 19.0621 5.09662 18.952C5.45858 18.8486 5.483 18.8375 5.49855 18.7685C5.50632 18.7307 5.48189 18.6696 5.44969 18.6495C5.43748 18.6418 5.26872 18.5906 5.07442 18.535C4.5981 18.3982 4.50706 18.3638 4.3383 18.2603C4.00965 18.0568 3.7565 17.7622 3.61772 17.4219C3.5944 17.3641 3.5289 17.155 3.47227 16.956C3.41565 16.7569 3.36235 16.5801 3.35347 16.5634C3.33904 16.5334 3.28019 16.4989 3.24799 16.5C3.24022 16.5011 3.21801 16.5078 3.19803 16.5167Z"
          fill="#262626"/>
      </svg>

      <Title c={'#262626'}>
        Текущие заказы
      </Title>
    </Group>

    <Stack gap={15}>
      {data?.orders.filter(ord => ord.status === 'in_progress').map(ord => <CardOrder key={ord.id} product={ord.items} total={ord.total} status={OrderStatus.IN_PROGRESS} date={new Date(ord.created_at)}/>)}
    </Stack>
    <Group gap={5} mb={10} mt={10}>
      <BoxImage size={26} color={'#262626'}/>

      <Title c={'#262626'}>
        Предыдущие заказы
      </Title>
    </Group>
    <Stack gap={15}>
      {data?.orders.filter(ord => ord.status === 'completed').map(ord => <CardOrder key={ord.id} product={ord.items} total={ord.total} status={OrderStatus.COMPLETED} date={new Date(ord.created_at)}/>)}
    </Stack>

  </Paper>)
}

interface CardOrderProps {
  status: OrderStatus
  date: Date
  total: number
  product: OrderItem[]
}

const CardOrder = ({status, date, total, product}: CardOrderProps) => {

  const [isOpen, setIsOpen] = useState<boolean>(false)

  return(
    <Paper onClick={() => {if (!isOpen) setIsOpen(prevState => !prevState)}} radius={16} p={10} bg={'transparent'} style={{border: '2px solid #141414'}}>
      <Group>
        {status === OrderStatus.IN_PROGRESS ? <Box bg={'#9EC5FE'} w={60} h={60} display={'flex'}
              style={{justifyContent: 'center', alignItems: 'center', borderRadius: 16}}>
          <Clock size={25} color={'#3D8BFD'}/>
        </Box> :
          <Box bg={'#A3CFBB'} w={60} h={60} display={'flex'}
               style={{justifyContent: 'center', alignItems: 'center', borderRadius: 16}}>
            <CheckCircle size={25} color={'#198754'}/>
          </Box>
        }
        <Stack gap={10}>
          <Text fw={700} c={'#000000'}>{status === 'in_progress' ? 'Заказ собирается' : "Заказ доставлен"}</Text>
          <Text fz={12} c={'#7B7B7B'}>от {`${date.getDay().toString().padStart(2,'0')}.${date.getMonth().toString().padStart(2,'0')}.${date.getFullYear()}`}</Text>
        </Stack>
        <Stack ml={'auto'} gap={10}>
          <Text fw={500} ml={'auto'} c={'#141414'} >{formatWithDot(total)}p.</Text>
          {isOpen && <Button
            onClick={() => setIsOpen(prevState => !prevState)}
            c={'black'}
            mt={-5}
            radius={8}
            bg={'transparent'}
            style={{border: '1px solid #141414'}}>
            Скрыть {isOpen ? <ChevronUp/> : <ChevronDown/>}
          </Button>}
        </Stack>
        {!isOpen && <ChevronDown style={{marginLeft: -5}} color={'black'}/>}
      </Group>
      <Collapse in={isOpen}>
        <Divider mt={10} c="#262626" />
        <Stack mt={10} gap={10}>
          {product.map((item, index) => (
            <ComponentOfCart
              key={index + item.name + item.quantity + item.price}
              name={item.name}
              quantity={item.quantity}
              price={item.price}
            />
          ))}
        </Stack>
      </Collapse>
    </Paper>
  )
}

const ComponentOfCart = ({name, quantity, price}: OrderItem) => {
  return (
    <Group>
      <Box bg={'#fff'} w={60} h={60} display={'flex'} style={{justifyContent: 'center', alignItems: 'center', borderRadius: 16}}>
        <BoxImage size={25} color={'#7B7B7B'}/>
      </Box>
      <Text fw={500} fz={18} c={'#000000'}>{name}</Text>
      <Stack ml={'auto'}>
        <Text fw={500} c={'#141414'}>{quantity}шт. <Cross
          size={8}
          style={{ transform: 'rotate(45deg)' }}
          fill="#141414"
        /> {price}p.</Text>
        <Text ml={'auto'} c={'#7B7B7B'} fz={12}>{quantity * price}p.</Text>
      </Stack>
    </Group>
  )
}
