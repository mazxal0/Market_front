'use client';

import { Group, Title, Button, Text, Drawer, Burger, Menu } from '@mantine/core';
import Link from 'next/link';
import classes from './Header.module.scss';
import { IconShoppingCart, IconUser } from '@tabler/icons-react';
import { userStore } from "@/stores";
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { cartStore } from "@/stores/cartStore";
import { usePathname, useRouter } from 'next/navigation';
import { FormatTotal } from "@/utils/formatTotal";
import { useMediaQuery } from '@mantine/hooks';
import {LogOut, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  height: number;
}

const Header = observer(({ height }: HeaderProps) => {
  const { name, isAuthenticated } = userStore;
  const [hydrated, setHydrated] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const isDesktop = useMediaQuery('(min-width: 1024px)', true);
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);

  const handleClick = (id: string) => {
    if (pathname !== '/') {
      router.push(`/#${id}`);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null

  return (
    <>
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
          zIndex: 5,
        }}
      >
        {/* Логотип */}
        <Title order={3} ml={20} style={{ margin: 0, fontSize: 20 }}>
          <Link href="/" className={classes.logo}>
            LESH
          </Link>
        </Title>

        {/* Меню — только на десктопе */}
        {isDesktop ? (
          <Group className={classes.menus} style={{ margin: '0 auto', gap: 32 }}>
            {[
              { label: 'Главная', id: 'home' },
              { label: 'Каталог', id: 'catalog' },
              { label: 'Контакты', id: 'contacts' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {item.label}
              </button>
            ))}
          </Group>
        ) : (
          <div />
        )}

        {/* Правая часть */}
        <Group mr={20} style={{ display: 'flex', gap: '12px', justifySelf: 'end' }}>
          {/* Корзина (всегда показываем) */}
          <Button
            onClick={() => cartStore.setIsOpenCart(!cartStore.isOpenCart)}
            radius="xl"
            bg="#141414FF"
            size="sm"
          >
            <IconShoppingCart size={18} />
            {isDesktop && (
              <Text fz={12} fw={500} c="#fff" ml={10}>
                {FormatTotal(cartStore.totalPrice)}
              </Text>
            )}
          </Button>

          {!isAuthenticated ? <Link href={'/auth/login'}>
            <Button
              radius="xl"
              bg="#141414FF"
              size="sm"
              leftSection={<IconUser size={18} />}
            > {name || 'Вход'}
            </Button>
          </Link> : isDesktop && hydrated && (
            <Menu width={180} shadow="md" position="bottom-end">
              <Menu.Target>
                <Button
                      radius="xl"
                      bg="#141414FF"
                      size="sm"
                      leftSection={<IconUser size={18} />}
                    >
                  {name || 'Вход'}
                </Button>
              </Menu.Target>

              <Menu.Dropdown bg={'#141414FF'} style={{borderRadius: 15}}>
                <Menu.Item
                  leftSection={<IconUser width={13} height={15}  />}
                  component={Link}
                  href={isAuthenticated ? "/profile?tab=user" : "/auth/login"}
                >
                  Профиль
                </Menu.Item>

                <Menu.Item
                  component={Link}
                  href="/profile?tab=orders"
                  leftSection={<ShoppingBag width={13} height={15} />}
                >
                  Заказы
                </Menu.Item>

                {isAuthenticated && (
                  <Menu.Item
                    color="red"
                    onClick={async () => {
                      await userStore.logout()
                      router.push("/")
                    }}
                    leftSection={<LogOut width={13} height={15} />}
                  >
                    Выйти
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          )}

          {/* Mobile: Burger */}
          {!isDesktop && (
            <Burger
              opened={mobileMenuOpened}
              onClick={() => setMobileMenuOpened(true)}
              size="sm"
              color="#fff"
            />
          )}
        </Group>
      </div>

      {/* Drawer — мобильное выезжающее меню */}
      <Drawer
        opened={mobileMenuOpened}
        onClose={() => setMobileMenuOpened(false)}
        position="right"
        padding="md"
        size="70%"
        overlayProps={{ opacity: 0.35 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Ссылки */}
          {[
            { label: 'Главная', id: 'home' },
            { label: 'Каталог', id: 'catalog' },
            { label: 'Контакты', id: 'contacts' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                handleClick(item.id);
                setMobileMenuOpened(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 18,
                textAlign: 'left',
                padding: '10px 0',
              }}
            >
              {item.label}
            </button>
          ))}

          {/* Кнопка профиля */}
          {hydrated && (
            <Link
              href={isAuthenticated ? '/profile?tab=user' : '/auth/login'}
              onClick={() => setMobileMenuOpened(false)}
            >
              <Button
                radius="xl"
                bg="#141414FF"
                size="md"
                fullWidth
                leftSection={<IconUser size={18} />}
              >
                {name || 'Вход'}
              </Button>
            </Link>
          )}
        </div>
      </Drawer>
    </>
  );
});

export default Header;
