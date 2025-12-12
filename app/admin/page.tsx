import {Button, Paper, Stack, Title } from "@mantine/core";
import Link from "next/link";

export default function AdminMainPage() {

  return <Paper p={150} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
    <Title mb={30}>Админ панель</Title>
    <Stack gap={30} align={'center'} justify={'center'}>
      <Link href={'admin/products'}><Button size={'lg'} w={300}>Управление товаром</Button></Link>
      <Link href={'admin/messages'}><Button size={'lg'} w={300}>Управление сообщениями</Button></Link>
      <Link href={'admin/orders'}><Button size={'lg'} w={300}>Управление заказами</Button></Link>
    </Stack>
  </Paper>
}
