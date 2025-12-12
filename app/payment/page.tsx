'use client'
import { useSearchParams } from 'next/navigation';
import {Button, Loader, Stack, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import { cartStore } from "@/stores/cartStore";
import Link from 'next/link';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const method = searchParams.get('method') || 'card'; // default card
  const [status, setStatus] = useState<"creating" | "redirecting" | "error">("creating");

  useEffect(() => {
    const processOrder = async () => {
      try {
        // 1. Создаём заказ
        const orderRes = await api.post(`/order/create?cart_id=${cartStore.cartId}`);
        await cartStore.fetchCart()
        const orderId = orderRes.data.order_id;

        // 2. Создаём платеж с методом из URL
        const paymentRes = await api.post(`/payments/${orderId}?method=${method}`);
        const confirmationUrl = paymentRes.data.confirmation_url;

        setStatus("redirecting");

        // 3. Редирект на ЮKassa
        window.location.href = confirmationUrl;
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    processOrder();
  }, [method]);

  return (
    <Stack justify={'center'} align={'center'} h={'80vh'}>
      <Title>
        {status === "creating" && "Создаем заказ..."}
        {status === "redirecting" && "Перенаправляем на страницу оплаты..."}
        {status === "error" && "Произошла ошибка при оплате"}
      </Title>
      {status !== 'error' ? <Loader/> : <Link href={'/'}><Button>Вернуться на главную страницу</Button></Link>}
    </Stack>
  );
}
