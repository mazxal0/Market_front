'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Divider,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  Loader
} from '@mantine/core';
import {
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Package,
  X
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import { OrderItem, OrderStatus } from '@/types';
import { formatWithDot } from '@/utils/formatWithDot';

interface CardOrderProps {
  orderId: string;
  status: OrderStatus;
  date: Date;
  total: number;
  products: OrderItem[];
}

interface CartItemProps {
  item: OrderItem;
}

// Компонент элемента корзины
const CartItem = ({ item }: CartItemProps) => {
  const { name, quantity, price } = item;
  const totalItemPrice = quantity * price;

  return (
    <Group wrap="nowrap" align="center">
      <Box
        w={60}
        h={60}
        bg="#fff"
        display="flex"
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 16,
          border: '1px solid #e0e0e0'
        }}
      >
        <Package size={25} color="#7B7B7B" />
      </Box>

      <Stack gap={0} style={{ flex: 1 }}>
        <Text fw={500} fz={16} c="#000000" truncate="end">
          {name}
        </Text>
        <Text fz={14} c="#7B7B7B">
          {price}p. × {quantity}шт.
        </Text>
      </Stack>

      <Text fw={600} fz={16} c="#141414">
        {formatWithDot(totalItemPrice)}p.
      </Text>
    </Group>
  );
};

// Основной компонент заказа
export default function AdminCardOrder({
                                         orderId,
                                         status: initialStatus,
                                         date,
                                         total,
                                         products
                                       }: CardOrderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const queryClient = useQueryClient();

  // Мутация для изменения статуса
  const { mutate: updateStatus, isPending } = useMutation<void, Error, OrderStatus>({
    mutationFn: async (newStatus: OrderStatus) => {
      await api.post(`/order/update-status?order_id=${orderId}&status=${newStatus}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'get-for-all-users'] });
    },
    onError: (error) => {
      console.error('Ошибка при обновлении статуса:', error);
      // Откатываем статус при ошибке
      setStatus(initialStatus);
    },
  });

  const handleStatusChange = (value: string | null) => {
    if (value && value !== status) {
      setStatus(value as OrderStatus);
      updateStatus(value as OrderStatus);
    }
  };

  // Форматирование даты
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const getStatusConfig = () => {
    switch (status) {
      case OrderStatus.IN_PROGRESS:
        return {
          bg: '#9EC5FE',
          icon: Clock,
          iconColor: '#3D8BFD',
          text: 'Заказ собирается'
        };
      case OrderStatus.COMPLETED:
        return {
          bg: '#A3CFBB',
          icon: CheckCircle,
          iconColor: '#198754',
          text: 'Заказ доставлен'
        };
      default:
        return {
          bg: '#f0f0f0',
          icon: Clock,
          iconColor: '#666',
          text: 'Статус неизвестен'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <Paper
      radius={16}
      p={20}
      bg="transparent"
      style={{
        border: '2px solid #141414',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <Group wrap="nowrap" align="center" gap="md">
        {/* Иконка статуса */}
        <Box
          w={60}
          h={60}
          bg={statusConfig.bg}
          display="flex"
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 16,
            flexShrink: 0
          }}
        >
          <StatusIcon size={25} color={statusConfig.iconColor} />
        </Box>

        {/* Информация о заказе */}
        <Stack gap={4} style={{ flex: 1 }}>
          <Text fw={700} fz={16} c="#000000">
            {statusConfig.text}
          </Text>
          <Text fz={12} c="#7B7B7B">
            от {formatDate(date)}
          </Text>
          <Text fz={12} c="#7B7B7B">
            ID: {orderId}
          </Text>
        </Stack>

        {/* Сумма и селектор */}
        <Stack gap={8} align="flex-end">
          <Text fw={600} fz={18} c="#141414">
            {formatWithDot(total)}p.
          </Text>

          <Group gap="xs" align="center">
            <Select
              value={status}
              onChange={handleStatusChange}
              data={[
                { value: OrderStatus.IN_PROGRESS, label: 'В процессе' },
                { value: OrderStatus.COMPLETED, label: 'Доставлено' },
              ]}
              disabled={isPending}
              styles={{
                root: { width: 150 },
                input: {
                  cursor: 'pointer',
                  backgroundColor: isPending ? '#f5f5f5' : undefined
                }
              }}
              rightSection={isPending ? <Loader size={16} /> : undefined}
            />
          </Group>
        </Stack>

        {/* Иконка раскрытия */}
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? (
            <ChevronUp size={24} color="#141414" />
          ) : (
            <ChevronDown size={24} color="#141414" />
          )}
        </Box>
      </Group>

      {/* Раскрывающаяся часть */}
      <Collapse in={isOpen}>
        <Divider my={16} color="#e0e0e0" />

        <Stack gap={12}>
          {products.map((item, index) => (
            <CartItem key={`${orderId}-${item.name || index}`} item={item} />
          ))}

          <Group justify="space-between" mt={4}>
            <Text fz={14} c="#7B7B7B">
              Товаров: {products.length}
            </Text>
            <Text fw={600} fz={18} c="#141414">
              Итого: {formatWithDot(total)}p.
            </Text>
          </Group>

          <Button
            mt={8}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            variant="outline"
            color="dark"
            radius={8}
            rightSection={isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            fullWidth
          >
            Скрыть детали
          </Button>
        </Stack>
      </Collapse>
    </Paper>
  );
}
