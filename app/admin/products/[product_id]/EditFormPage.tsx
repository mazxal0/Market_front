'use client'

import { useState, useEffect, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Text, Checkbox, NumberInput, Paper, Stack, Textarea, TextInput,
  Title, Button, Group, Select
} from "@mantine/core";
import { useForm } from "@mantine/form";
import ImagesUploader from '@/components/ImagesUploader/ImagesUploader';
import api from '@/api/axios';
import { CreateProcessor, CreateFlashDriver } from '@/types';
import Link from 'next/link';

interface Props {
  productId: string;
  typeProduct: 'processor' | 'flashdrive';
}

export default function EditProductPage({ productId, typeProduct }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const processorForm = useForm<CreateProcessor>({
    initialValues: {
      name: '',
      brand: '',
      retail_price: 0,
      wholesale_price: 0,
      wholesale_min_qty: 0,
      stock: 0,
      line: '',
      architecture: '',
      socket: '',
      base_frequency: 0,
      turbo_frequency: 0,
      cores: 0,
      threads: 0,
      l1_cache: '',
      l2_cache: '',
      l3_cache: '',
      lithography: '',
      tdp: 0,
      features: '',
      memory_type: '',
      max_ram: '',
      max_ram_frequency: '',
      integrated_graphics: false,
      graphics_model: '',
      max_temperature: 0,
      package_contents: '',
      country_of_origin: '',
      images: [],
    },
    validate: {
      name: (v) => v.trim() ? null : 'Название обязательно',
      brand: (v) => v.trim() ? null : 'Выберите бренд',
      retail_price: (v) => v > 0 ? null : 'Розничная цена должна быть больше 0',
      wholesale_price: (v) => v > 0 ? null : 'Оптовая цена должна быть больше 0',
      cores: (v) => v > 0 ? null : 'Количество ядер должно быть больше 0',
      threads: (v) => v > 0 ? null : 'Количество потоков должно быть больше 0',
      socket: (v) => v.trim() ? null : 'Сокет обязателен',
      line: (v) => v.trim() ? null : 'Линейка обязателен',
    },
  });

  const flashForm = useForm<CreateFlashDriver>({
    initialValues: {
      name: '',
      brand: '',
      retail_price: 0,
      wholesale_price: 0,
      wholesale_min_qty: 0,
      stock: 0,
      capacity_gb: 0,
      usb_interface: '',
      form_factor: '',
      read_speed: 0,
      write_speed: 0,
      chip_type: '',
      otg_support: false,
      body_material: '',
      color: '',
      water_resistance: false,
      dust_resistance: false,
      shockproof: false,
      cap_type: '',
      length_mm: 0,
      width_mm: 0,
      thickness_mm: 0,
      weight_g: 0,
      compatibility: '',
      operating_temp: '',
      storage_temp: '',
      country_of_origin: '',
      package_contents: '',
      warranty_months: 0,
      features: '',
      images: [],
    },
    validate: {
      name: (v) => v.trim() ? null : 'Название обязательно',
      brand: (v) => v.trim() ? null : 'Бренд обязателен',
      retail_price: (v) => v > 0 ? null : 'Розничная цена должна быть больше 0',
      capacity_gb: (v) => v > 0 ? null : 'Укажите объем памяти',
      usb_interface: (v) => v.trim() ? null : 'Интерфейс USB обязателен',
      compatibility: (v) => v.trim() ? null : 'Совместимость обязательна',
    },
  });

  // Загрузка данных продукта
  useEffect(() => {
    if (!productId || !typeProduct) return;
    const fetchData = async () => {
      try {
        const url = typeProduct === 'processor' ? `/processor/${productId}` : `/flash-driver/${productId}`;
        const response = await api.get(url);
        const data = response.data.processor || response.data.flash_drive;

        if (typeProduct === 'processor') processorForm.setValues(data);
        if (typeProduct === 'flashdrive') flashForm.setValues(data);
      } catch (error) {
        console.error('Ошибка загрузки данных продукта', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const onSubmit = async () => {
    if (!productId) return;

    if (typeProduct === 'processor') {
      processorForm.onSubmit(async (values) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key === 'images') {
            value.forEach((file: File) => formData.append('images', file));
          } else if (typeof value === 'boolean') {
            formData.append(key, value ? 'true' : 'false');
          } else {
            formData.append(key, value.toString());
          }
        });

        await api.patch(`/processor/${productId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        alert("Процессор обновлен успешно!");
        router.push('/admin/products');
      })();
    }

    if (typeProduct === 'flashdrive') {
      flashForm.onSubmit(async (values) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key === 'images') {
            value.forEach((file: File) => formData.append('images', file));
          } else if (typeof value === 'boolean') {
            formData.append(key, value ? 'true' : 'false');
          } else {
            formData.append(key, value.toString());
          }
        });

        await api.patch(`/flash-driver/${productId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        alert("Флешка обновлена успешно!");
        router.push('/admin/products');
      })();
    }
  }

  const onClearFormData = () => {
    if (typeProduct === 'processor') processorForm.reset();
    if (typeProduct === 'flashdrive') flashForm.reset();
  }

  if (loading) return <Text>Загрузка данных...</Text>;
  if (!typeProduct) return <Text>Не указан тип продукта</Text>;

  return (
    <Paper px={50} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Group align={'center'} justify={'center'} mt={50}>
        <Title>Редактировать продукт</Title>
        <Link href={'/admin/products'}>
          <Button>Назад</Button>
        </Link>
      </Group>

      <Stack w={500} gap={20} justify={'center'} mb={200} mt={20}>
        {typeProduct === 'processor' && (
          <>
            <Text fw={600} size="lg">Характеристики процессора</Text>
            <TextInput label="Название" {...processorForm.getInputProps('name')} />
            <Select label="Бренд" data={[{value:'Intel', label:'Intel'}, {value:'Ryzen', label:'Ryzen'}]} {...processorForm.getInputProps('brand')} />
            <NumberInput label="Розничная цена" {...processorForm.getInputProps('retail_price')} />
            <NumberInput label="Оптовая цена" {...processorForm.getInputProps('wholesale_price')} />
            <NumberInput label="Мин. опт. количество" {...processorForm.getInputProps('wholesale_min_qty')} />
            <NumberInput label="Количество на складе" {...processorForm.getInputProps('stock')} />
            <TextInput label="Линейка" {...processorForm.getInputProps('line')} />
            <TextInput label="Архитектура" {...processorForm.getInputProps('architecture')} />
            <TextInput label="Сокет" {...processorForm.getInputProps('socket')} />
            <NumberInput label="Базовая частота (MHz)" {...processorForm.getInputProps('base_frequency')} />
            <NumberInput label="Турбочастота (MHz)" {...processorForm.getInputProps('turbo_frequency')} />
            <NumberInput label="Ядра" {...processorForm.getInputProps('cores')} />
            <NumberInput label="Потоки" {...processorForm.getInputProps('threads')} />
            <TextInput label="Кэш L1" {...processorForm.getInputProps('l1_cache')} />
            <TextInput label="Кэш L2" {...processorForm.getInputProps('l2_cache')} />
            <TextInput label="Кэш L3" {...processorForm.getInputProps('l3_cache')} />
            <TextInput label="Техпроцесс" {...processorForm.getInputProps('lithography')} />
            <NumberInput label="TDP (Вт)" {...processorForm.getInputProps('tdp')} />
            <Textarea label="Особенности" {...processorForm.getInputProps('features')} />
            <TextInput label="Тип памяти" {...processorForm.getInputProps('memory_type')} />
            <TextInput label="Макс. RAM" {...processorForm.getInputProps('max_ram')} />
            <TextInput label="Макс. частота RAM" {...processorForm.getInputProps('max_ram_frequency')} />
            <Checkbox label="Интегрированная графика" {...processorForm.getInputProps('integrated_graphics', {type:'checkbox'})} />
            {processorForm.values.integrated_graphics && <TextInput label="Модель встроенной графики" {...processorForm.getInputProps('graphics_model')} />}
            <NumberInput label="Макс. температура (°C)" {...processorForm.getInputProps('max_temperature')} />
            <TextInput label="Комплектация" {...processorForm.getInputProps('package_contents')} />
            <TextInput label="Страна производитель" {...processorForm.getInputProps('country_of_origin')} />
            <ImagesUploader form={processorForm} />
          </>
        )}

        {typeProduct === 'flashdrive' && (
          <>
            <Text fw={600} size="lg">Характеристики флешки</Text>
            <TextInput label="Название" {...flashForm.getInputProps('name')} />
            <TextInput label="Бренд" {...flashForm.getInputProps('brand')} />
            <NumberInput label="Розничная цена" {...flashForm.getInputProps('retail_price')} />
            <NumberInput label="Оптовая цена" {...flashForm.getInputProps('wholesale_price')} />
            <NumberInput label="Мин. опт. количество" {...flashForm.getInputProps('wholesale_min_qty')} />
            <NumberInput label="Количество на складе" {...flashForm.getInputProps('stock')} />
            <NumberInput label="Объем (GB)" {...flashForm.getInputProps('capacity_gb')} />
            <TextInput label="Интерфейс USB" {...flashForm.getInputProps('usb_interface')} />
            <TextInput label="Форм-фактор" {...flashForm.getInputProps('form_factor')} />
            <NumberInput label="Скорость чтения (MB/s)" {...flashForm.getInputProps('read_speed')} />
            <NumberInput label="Скорость записи (MB/s)" {...flashForm.getInputProps('write_speed')} />
            <TextInput label="Тип чипа" {...flashForm.getInputProps('chip_type')} />
            <Checkbox label="Поддержка OTG" {...flashForm.getInputProps('otg_support', {type:'checkbox'})} />
            <TextInput label="Материал корпуса" {...flashForm.getInputProps('body_material')} />
            <TextInput label="Цвет" {...flashForm.getInputProps('color')} />
            <Checkbox label="Влагозащита" {...flashForm.getInputProps('water_resistance', {type:'checkbox'})} />
            <Checkbox label="Пылезащита" {...flashForm.getInputProps('dust_resistance', {type:'checkbox'})} />
            <Checkbox label="Ударопрочность" {...flashForm.getInputProps('shockproof', {type:'checkbox'})} />
            <TextInput label="Тип крышки" {...flashForm.getInputProps('cap_type')} />
            <NumberInput label="Длина (мм)" {...flashForm.getInputProps('length_mm')} />
            <NumberInput label="Ширина (мм)" {...flashForm.getInputProps('width_mm')} />
            <NumberInput label="Толщина (мм)" {...flashForm.getInputProps('thickness_mm')} />
            <NumberInput label="Вес (г)" {...flashForm.getInputProps('weight_g')} />
            <TextInput label="Совместимость" {...flashForm.getInputProps('compatibility')} />
            <TextInput label="Рабочая температура" {...flashForm.getInputProps('operating_temp')} />
            <TextInput label="Температура хранения" {...flashForm.getInputProps('storage_temp')} />
            <TextInput label="Страна производитель" {...flashForm.getInputProps('country_of_origin')} />
            <TextInput label="Комплектация" {...flashForm.getInputProps('package_contents')} />
            <NumberInput label="Гарантия (месяцев)" {...flashForm.getInputProps('warranty_months')} />
            <Textarea label="Особенности" {...flashForm.getInputProps('features')} />
            <ImagesUploader form={flashForm} />
          </>
        )}

        <Button onClick={onSubmit}>Сохранить изменения</Button>
        <Button onClick={onClearFormData} color="red">Очистить форму</Button>
      </Stack>
    </Paper>
  )
}
