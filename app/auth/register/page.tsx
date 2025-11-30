'use client';

import { useState } from 'react';
import { Container, Paper, TextInput, PasswordInput, Button, Title, Text, Group, Anchor, MantineProvider, Stack, Box, AppShell } from '@mantine/core';
import { useForm } from '@mantine/form';
import Link from 'next/link';
import {UserRegistration} from "@/types";

export default function RegisterPage() {
  const form = useForm<UserRegistration>({
    initialValues: {
      name: '',
      surname: '',
      lastname: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Неверный email'),
      password: (value: string) => (value.length >= 6 ? null : 'Минимум 6 символов'),
      confirmPassword: (value: string, values: { email: string; password: string; confirmPassword: string }) =>
        value === values.password ? null : 'Пароли не совпадают',
    },
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: typeof form.values) => {
    setLoading(true);
    setTimeout(() => {
      alert(`Регистрация успешна для ${values.email}`);
      setLoading(false);
    }, 1000);
  };

  return (
      <Paper my={10} bg={"#EEEEEE"} radius={"md"} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: "200px" }}>
        <Title order={1} ta="center" c={"black"} fw={500}>Регистрация</Title>
        <Text color="dark.7" size="sm" ta="center" mt={5}>
          Уже есть аккаунт?{' '}
          <Anchor component={Link} href="/login" size="sm">
            Войти
          </Anchor>
        </Text>

        <Paper bg={"transparent"} p={30} mt={30} radius="md" ml={15} mr={15} pl={150} pr={150}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap={"md"}>
            <TextInput
              placeholder="Фамилия*"
              styles={{
                input: {
                  backgroundColor: 'transparent',
                  color: "black",
                  '&::placeholder': {
                    color: 'black',
                  }
                }
              }}
              {...form.getInputProps('surname')}
              required
            />
            <Group grow>
              <TextInput
                placeholder="Имя*"
                styles={{
                  input: {
                    backgroundColor: 'transparent',
                    color: "black",
                    '&::placeholder': {
                      color: 'black',
                    }
                  }
                }}
                {...form.getInputProps('name')}
                required
              />
              <TextInput
                placeholder="Отчество*"
                styles={{
                  input: {
                    backgroundColor: 'transparent',
                    color: "black",
                    '&::placeholder': {
                      color: 'black',
                    }
                  }
                }}
                {...form.getInputProps('lastname')}
                required
              />
            </Group>
              <TextInput
                placeholder="E-mail*"
                styles={{
                  input: {
                    backgroundColor: 'transparent',
                    color: "black",
                    '&::placeholder': {
                      color: 'black',
                    }
                  }
                }}
                {...form.getInputProps('email')}
                required
              />
              <TextInput
                placeholder="Телефон*"
                styles={{
                  input: {
                    backgroundColor: 'transparent',
                    color: "black",
                    '&::placeholder': {
                      color: 'black',
                    }
                  }
                }}
                {...form.getInputProps('phone')}
                required
              />
            <Group grow>
              <PasswordInput
                placeholder="Пароль*"
                styles={{
                  input: {
                    backgroundColor: 'transparent',
                    color: "black",
                    '&::placeholder': {
                      color: 'black',
                    }
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
              <PasswordInput
                placeholder="Пароль еще раз*"
                styles={{
                  input: {
                    backgroundColor: 'transparent',
                    color: "black",
                    '&::placeholder': {
                      color: 'black',
                    },

                  },
                  visibilityToggle: {
                    color: 'black !important',
                    '&:hover': {
                      color: 'darkgray !important',
                    },
                  },
                }}
                {...form.getInputProps('confirmPassword')}
                required
              />
            </Group>
            </Stack>
            <Button type="submit" fullWidth mt="xl" bg={"dark"} loading={loading}>
              Зарегистрироваться
            </Button>

          </form>
        </Paper>
      </Paper>

  );
}
