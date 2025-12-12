import { Group, Paper, Stack, Text, Image, TextInput, Textarea, Button, SimpleGrid, Grid, Divider } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Message } from "@/types/message";
import axios from "axios";
import { FormEvent } from 'react'
import api from "@/api/axios";

export default function ContactsPage() {
  const form = useForm<Message>({
    initialValues: {
      name: '',
      number: '',
      email: '',
      message: '',
    },
    validate: {
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Неверный email'),
      name: (value: string) => (value.length > 0 ? null : 'Поле обязательно'),
    },
  });

  const handleSubmit = async (values: Message) => {
    try {
      await api.post('/message/send', values); // путь к твоему API
      alert("Сообщение отправлено!");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Ошибка при отправке сообщения");
    }
  };

  return (
    <div style={{position: 'relative'}}>
      <Paper
        bg={'#EEEEEE'}
        radius={'xl'}
        pos={'relative'}
        mt={20}
        px={50}
        py={20}
        style={{display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden'}}
      >
        <Text mb={30} fw={600} fz={36} c={'black'}>Профессиональный подход к каждому клиенту</Text>

        <Group gap={50}>
          <Group h={130}>
            <Divider size={1} color={'#343A40'} orientation={'vertical'}/>
            <Stack w={310}>
              <Text c={'#262626'} fw={500} fz={18}>Мгновенный подбор и наличие</Text>
              <Text c={'#7B7B7B'} fw={500} fz={12}>Глубокая интеграция с системами поставщиков позволяет нам
                предоставлять актуальную информацию о наличии и лучшие цены на рынке. Вы получаете идеальный товар для
                ваших задач без задержек.</Text>
            </Stack>
          </Group>
          <Group h={130}>
            <Divider size={1} color={'#343A40'} orientation={'vertical'}/>
            <Stack w={350} mt={-15}>
              <Text c={'#262626'} fw={500} fz={18}>Гарантия качества и прозрачность</Text>
              <Text c={'#7B7B7B'} fw={500} fz={12}>Строгий входной контроль и многоуровневая система проверки исключают
                риски. Каждая единица товара сопровождается полным пакетом документов для вашего спокойствия.</Text>
            </Stack>
          </Group>
          <Group h={130}>
            <Divider size={1} color={'#343A40'} orientation={'vertical'}/>
            <Stack w={320}>
              <Text c={'#262626'} fw={500} fz={18}>Официальные поставки</Text>
              <Text c={'#7B7B7B'} fw={500} fz={12}>Мы работаем исключительно с официальными дистрибьюторами, что
                гарантирует подлинность каждого процессора, полную гарантию производителя и абсолютное соответствие
                российскому законодательству.</Text>
            </Stack>
          </Group>
        </Group>

        <Image
          width={352}
          height={328}
          src={'/images/Mountain_big.png'}
          alt={''}
          style={{right: 0, bottom: 0}}
        />
      </Paper>

      <Paper bg={'transparent'} id={'contacts'} mt={75} pl={75} pr={75}>
        <Grid gutter={50}>
          {/* Левая колонка */}
          <Grid.Col span={6}>
            <Stack>
              <Text fw={500} fz={32} c={'#eee'} ta={'center'}>Наша команда рядом</Text>
              <Text fw={500} fz={18} c={'#7B7B7B'}>
                Остались вопросы? Интересует того что нет в каталоге? Заполните форму обратной связи, опишите вкратце
                ваш вопрос и мы свяжемся с вами в ближайшее время!
              </Text>
              <Text fw={500} fz={20} c={'#eee'}>Почта</Text>
              <Text fw={500} fz={18} c={'#7B7B7B'}>leshInfo@gmail.com</Text>
              <Text fw={500} fz={20} c={'#eee'}>Телефон</Text>
              <Text fw={500} fz={18} c={'#7B7B7B'}>+7 900 888 77 66</Text>
            </Stack>
            <Text mt={20} fz={30} fw={600} c={'#eee'}>
              LESH
            </Text>
          </Grid.Col>

          {/* Правая колонка — форма */}
          <Grid.Col span={6}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack>
                <TextInput size={'md'} placeholder="Имя*" {...form.getInputProps('name')} />
                <TextInput size={'md'} placeholder="Email*" {...form.getInputProps('email')} />
                <TextInput type={'number'} size={'md'} placeholder="Телефон" {...form.getInputProps('number')} />
                <Textarea
                  size={'md'}
                  placeholder="Введите текст"
                  autosize
                  minRows={5}
                  maxRows={5}
                  {...form.getInputProps('message')}
                />
                <Button radius={8} bg={'#eee'} c={'#262626'} fz={18} fw={500} size={'md'} type="submit">Получить
                  консультацию</Button>
              </Stack>
            </form>
            <Text ta={'end'} ml={'auto'} mt={20} fw={500} fz={12} c={'#7B7B7B'}>2025 © LESH | Не является публичной
              офертой
              ООО «LESH», ИНН 7342182100</Text>
          </Grid.Col>
        </Grid>

      </Paper>
      <div style={{position: "absolute", bottom: -30, left: '50%', transform: 'translate(-50%)', zIndex: -1}}>
        <Image
          width={'100%'}
          src={'/images/Decoration.png'}
          alt={''}
          style={{}}
        />
      </div>
    </div>
  );
}
