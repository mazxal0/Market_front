'use client';

import { useState } from 'react';
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Group,
  Anchor,
  Stack,
  Modal,
  PinInput,
} from '@mantine/core';
import Image from "next/image";
import { useForm } from '@mantine/form';
import Link from 'next/link';
import {UserLogin} from '@/types';
import {userStore} from "@/stores";
import { useRouter } from 'next/navigation';
import VerifyCodeModal from "@/components/Modals/VerifyCode";

export default function LoginPage() {
  const form = useForm<UserLogin>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Неверный email'),
      password: (value: string) => (value.length >= 6 ? null : 'Минимум 6 символов'),
    },
  });

  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const {error} = userStore

  const [codeModalOpen, setCodeModalOpen] = useState(false);


  const handleSubmit = async (values: typeof form.values) => {
    try {
      await userStore.login(values.email, values.password)
      setCodeModalOpen(true)
    } catch (err) {
      // console.log(err)
    }
  };

  return (
<>
      <Paper
        bg={'#EEEEEE'}
        radius={'xl'}
        pos={'relative'}
        // p={{ base: 'md', sm: 'xl' }}
        style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        {/* Верхний левый шарик */}
        <div style={{
          position: 'absolute',
          top: 15,
          left: 25,
          width: 10,
          height: 10,
          backgroundColor: 'black',
          borderRadius: '50%',
        }} />

        {/* Верхняя полоса между шариками */}
        <div style={{
          position: 'absolute',
          top: 15,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60px',
          height: 10,
          backgroundColor: 'black',
          borderRadius: 5,
        }} />

        {/* Верхний правый шарик */}
        <div style={{
          position: 'absolute',
          top: 15,
          right: 25,
          width: 10,
          height: 10,
          backgroundColor: 'black',
          borderRadius: '50%',
        }} />

        {/* Нижний левый шарик */}
        <div style={{
          position: 'absolute',
          bottom: 15,
          left: 25,
          width: 10,
          height: 10,
          backgroundColor: 'black',
          borderRadius: '50%',
        }} />

        {/* Нижний правый шарик */}
        <div style={{
          position: 'absolute',
          bottom: 15,
          right: 25,
          width: 10,
          height: 10,
          backgroundColor: 'black',
          borderRadius: '50%',
        }} />

        <div>
          <Image
            width={352}
            height={328}
            src={'/images/BackImageAuth.png'}
            alt={''}
            style={{
              position: 'absolute',
              width: '352px',
              height: '328px',
              top: 0,
              transform: 'rotate(180deg)',
            }}
          />

          <Image
            width={352}
            height={328}
            src={'/images/BackImageAuth.png'}
            alt={''}
            style={{
              position: 'absolute',
              width: '352px',
              height: '328px',
              right: 0,
              bottom: 0,
            }}
          />
        </div>

        <Title order={1} ta="center" c="black" fw={600}>
          Вход
        </Title>

        <Paper
          bg="transparent"
          p={{ base: 'md', sm: 'lg', md: 40 }}
          mx="auto"
          w={{ base: '90%', sm: '70%', md: '65%', lg: 420 }}

        >
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                placeholder="E-mail*"
                size={"md"}
                styles={{ input: { backgroundColor: 'transparent', color: 'black' } }}
                {...form.getInputProps('email')}
                required
              />
                <PasswordInput
                  placeholder="Пароль*"
                  size={"md"}

                  styles={{
                    input: {
                      backgroundColor: 'transparent',
                      color: 'black'
                    },
                    visibilityToggle: {
                      color: 'black !important',
                      '&:hover': {
                        color: 'darkgray !important',
                      },
                    },
                  }}
                  {...form.getInputProps('password')}
                  required
                />
              {error && <Text ta={'center'} c={'red'}>
                {error}
              </Text>}
              <Button type="submit" fullWidth size={"md"} bg="#262626" loading={loading}>
                Войти
              </Button>
            </Stack>
            <Text size="sm" ta="center" mt={15}>
              <Anchor c={'#262626'} component={Link} href="register" size={'md'}>
                Зарегистрироваться
              </Anchor>
            </Text>
          </form>
        </Paper>
      </Paper>
  <VerifyCodeModal setCodeModalOpen={setCodeModalOpen} codeModalOpen={codeModalOpen} email={form.values.email}/>
</>
  );
}
