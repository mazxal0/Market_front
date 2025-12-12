'use client';

import {useEffect, useState } from 'react';
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
  SegmentedControl,
  Loader,
  Divider,
  CloseButton,
} from '@mantine/core';
import Image from "next/image";
import { useForm } from '@mantine/form';
import Link from 'next/link';
import {ChangeUser, User} from '@/types';
import {userStore} from "@/stores";
import { useRouter, useSearchParams } from 'next/navigation';
import styles from "./profile.module.scss"
import { Pencil, X } from "lucide-react";
import {useQuery } from '@tanstack/react-query';
import { fetchProfile, updateProfile } from '@/api/profile';
import UserProfile from "@/app/profile/user";
import OrdersPage from "@/app/profile/orders";

export default function Profile() {


  const router = useRouter()
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);

  const tab = searchParams.get('tab') as ('user' | 'order')


  return (
    <>
      <Paper
        bg={'#EEEEEE'}
        radius={'xl'}
        pos={'relative'}
        // p={{ base: 'md', sm: 'xl' }}
        style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div>
          <Image
            width={352}
            height={328}
            src={'/images/Mountain.png'}
            alt={''}
            style={{
              position: 'absolute',
              width: '352px',
              height: '328px',
              top: 0,
              left: 0
            }}
          />
          <Image
            width={352}
            height={328}
            src={'/images/Mountain.png'}
            alt={''}
            style={{
              position: 'absolute',
              width: '352px',
              height: '328px',
              right: 0,
              bottom: 0,
              transform: 'rotate(180deg)',
            }}
          />
        </div>

        <Title c={'black'} fw={500} fz={36} mt={45} ta={'center'}>Личный кабинет</Title>
        <SegmentedControl
          size="md"
          mt={30}
          w={500}
          radius={12}
          classNames={{
            root: styles.segmentedRoot,
            indicator: styles.segmentedIndicator,
            label: styles.segmentedLabel,
            control: styles.segmentedControl, // ← добавьте
          }}
          value={tab}
          onChange={(value) => {
            router.push(`?tab=${value}`);
          }}
          data={[
            { value: 'user', label: "Профиль" },
            { value: 'orders', label: "Заказы" },
          ]}
        />
      { tab === 'user' ?
          <UserProfile/>
        :
        <OrdersPage/>
      }
      </Paper>
    </>

  )
    ;
}
