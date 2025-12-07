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
import { useForm } from '@mantine/form';
import Link from 'next/link';
import { UserRegistration } from '@/types';
import {userStore} from "@/stores";
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const form = useForm<UserRegistration>({
        initialValues: {
            name: '',
            surname: '',
            last_name: '',
            number: '',
            email: '',
            password: '',
            repeat_password: '',
        },
        validate: {
            email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Неверный email'),
            password: (value: string) => (value.length >= 6 ? null : 'Минимум 6 символов'),
            name: (value: string) =>
              value.length < 2 ? "Имя должно быть минимум 2 символа" :
                value.length > 60 ? "Имя должно быть максимум 60 символов" :
                  null
            ,
            repeat_password: (value: string, values: UserRegistration) =>
                value === values.password ? null : 'Пароли не совпадают',
        },
    });

    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const [codeModalOpen, setCodeModalOpen] = useState(false);
    const [code, setCode] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleSubmit = async (values: typeof form.values) => {
        try {
            await userStore.register(values)
            setCodeModalOpen(true)
        } catch (err) {
            // console.log(err)
        }
    };

    return (
      <>
            <Paper
                bg="#EEEEEE"
                radius={'xl'}
                p={{ base: 'md', sm: 'xl' }}
                pos={'relative'}
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
                    top: 15,                 // чуть ниже верхних шариков
                    left: '50%',             // центр по горизонтали
                    transform: 'translateX(-50%)', // сдвигаем влево на половину ширины
                    width: '60px',           // ширина линии
                    height: 10,              // толщина линии
                    backgroundColor: 'black',
                    borderRadius: 5,         // сглаженные края
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
                <Title order={1} ta="center" c="black" fw={600}>
                    Регистрация
                </Title>

                <Paper
                    bg="transparent"
                    p={{ base: 'md', sm: 'lg', md: 40 }}
                    radius="md"
                    mx="auto"
                    w={{ base: '90%', sm: '70%', md: '65%', lg: '45%', xl: '37%' }}
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
                                    {...form.getInputProps('last_name')}
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
                                {...form.getInputProps('number')}
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
                                    {...form.getInputProps('repeat_password')}
                                    required
                                />
                            </Group>
                        </Stack>

                        <Button type="submit" fullWidth mt="xl" size={"md"} bg="#262626" loading={loading}>
                            Зарегистрироваться
                        </Button>

                        <Text size="sm" ta="center" mt={15}>
                            <Anchor c={'#262626'} component={Link} href="login" size={'md'}>
                                Войти
                            </Anchor>
                        </Text>
                    </form>
                </Paper>
            </Paper>

          <Modal
            opened={codeModalOpen}
            onClose={() => setCodeModalOpen(false)}
            title="Подтверждение"
            centered
            overlayProps={{
                blur: 3
            }}
            c={'black'}
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
                    marginLeft: 20,
                    // marginTop: 20// убираем лишние маргины
                },
                body: {
                    padding: '20px',          // паддинг для контента
                    backgroundColor: '#eee',
                },
            }}
          >
              <Stack>
                  <Text
                    size="md"
                    ta="center"
                    styles={{
                        root: {
                            width: '100%',         // контейнер на всю ширину модалки
                            display: 'flex',
                            justifyContent: 'center', // центрируем содержимое
                        },
                    }}
                  >
                    <span style={{ maxWidth: 350, display: 'block' }}>
                      Введите код подтверждения, отправленный вам на почту
                    </span>
                  </Text>

                  <PinInput
                    length={6}
                    value={code}
                    onChange={setCode}
                    oneTimeCode
                    size="lg"
                    c={'black'}
                    inputMode="numeric"
                    type="number"
                    styles={{
                        root: {
                            display: 'flex',
                            justifyContent: 'center', // Центрируем все ячейки
                            gap: '10px',              // Расстояние между ячейками
                        },
                        input: {
                            backgroundColor: 'white',
                            borderColor: 'gray',
                            borderRadius: 8,
                            width: 50,
                            height: 50,
                            fontSize: 24,
                            textAlign: 'center',
                            color: '#000',
                        },
                    }}
                  />

                  <Button
                    mt="md"
                    size="lg"
                    bg={'#262626'}
                    fw={500}
                    fz={18}
                    loading={confirmLoading}
                    onClick={async () => {
                        try {
                            setConfirmLoading(true)

                            await userStore.secondFAMethod(code, form.values.email) // 👈 твой API

                            setCodeModalOpen(false)
                            router.push('/')

                        } catch (e) {
                            alert('Неверный код')
                        } finally {
                            setConfirmLoading(false)
                        }
                    }}
                  >
                      Подтвердить
                  </Button>
              </Stack>
          </Modal>
      </>
    );
}
