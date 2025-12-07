'use client';

import { Group, Title, Button } from '@mantine/core';
import Link from 'next/link';
import classes from './Header.module.scss';
import { IconShoppingCart, IconUser } from '@tabler/icons-react';
import { userStore } from "@/stores";
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

interface HeaderProps {
  height: number;
}

const Header = observer(({ height }: HeaderProps) => {
  const { name, isAuthenticated } = userStore;
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true); // Компонент клиентский, гидрируем state
  }, []);

  return (
    <div
      className={classes.headerWrapper}
      style={{
        height: `${height}px`,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '0 20px',
        backgroundColor: '#000',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      {/* Логотип */}
      <Title order={3} ml={20} style={{ margin: 0, fontSize: 20 }}>
        <Link href="/" className={classes.logo}>LESH</Link>
      </Title>

      {/* Меню */}
      <Group className={classes.menus} style={{ margin: '0 auto', gap: 32 }}>
        {['Главная', 'Каталог', 'Контакты'].map(item => (
          <Link key={item} href={`/${item.toLowerCase()}`} className={classes.menuItem}>
            {item}
          </Link>
        ))}
      </Group>

      {/* Кнопки */}
      <Group mr={20} style={{ display: 'flex', gap: '12px', justifySelf: 'end' }}>
        <Link href="/cart">
          <Button radius="xl" bg="#141414FF" size="sm">
            <IconShoppingCart size={18}/>
          </Button>
        </Link>

        {hydrated && (
          <Link href={isAuthenticated ? "/profile?tab=user" : "/auth/login"}>
            <Button radius="xl" bg="#141414FF" size="sm" leftSection={<IconUser size={18}/>}>
              {name || 'Вход'}
            </Button>
          </Link>
        )}
      </Group>
    </div>
  );
});

export default Header;
