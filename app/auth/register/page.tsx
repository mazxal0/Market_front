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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import Link from 'next/link';
import { UserRegistration } from '@/types';

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
            confirmPassword: (value: string, values: any) =>
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
        <Container size="lg" py="xl">
            <Paper
                bg="#EEEEEE"
                radius="lg"
                p={{ base: 'md', sm: 'xl' }}
                style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
                <Title order={1} ta="center" c="black" fw={600}>
                    Регистрация
                </Title>

                <Paper
                    bg="transparent"
                    p={{ base: 'md', sm: 'lg', md: 40 }}
                    radius="md"
                    mx="auto"
                    w={{ base: '90%', sm: '70%', md: '65%', lg: '55%' }}
                >
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack gap="md">
                            <TextInput
                                placeholder="Фамилия*"
                                size={"md"}
                                styles={{ input: { backgroundColor: 'transparent', color: 'black' } }}
                                {...form.getInputProps('surname')}
                                required
                            />

                            <Group grow wrap="wrap">
                                <TextInput
                                    placeholder="Имя*"
                                    size={"md"}
                                    styles={{ input: { backgroundColor: 'transparent', color: 'black' } }}
                                    {...form.getInputProps('name')}
                                    required
                                />
                                <TextInput
                                    placeholder="Отчество*"
                                    size={"md"}

                                    styles={{ input: { backgroundColor: 'transparent', color: 'black' } }}
                                    {...form.getInputProps('lastname')}
                                    required
                                />
                            </Group>

                            <TextInput
                                placeholder="E-mail*"
                                size={"md"}
                                styles={{ input: { backgroundColor: 'transparent', color: 'black' } }}
                                {...form.getInputProps('email')}
                                required
                            />

                            <TextInput
                                placeholder="Телефон*"
                                size={"md"}
                                styles={{ input: { backgroundColor: 'transparent', color: 'black' } }}
                                {...form.getInputProps('phone')}
                                required
                            />

                            <Group grow wrap="wrap">
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
                                <PasswordInput
                                    placeholder="Пароль еще раз*"
                                    size={"md"}
                                    styles={{
                                        input: {
                                            backgroundColor: 'transparent',
                                            color: 'black',
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

                        <Button type="submit" fullWidth mt="xl" size={"md"} bg="dark" loading={loading}>
                            Зарегистрироваться
                        </Button>

                        <Text c={'dark.7'} size="sm" ta="center" mt={5}>
                            Уже есть аккаунт?{' '}
                            <Anchor component={Link} href="login" size="sm">
                                Войти
                            </Anchor>
                        </Text>
                    </form>
                </Paper>
            </Paper>
        </Container>
    );
}
