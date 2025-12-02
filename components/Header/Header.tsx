'use client';

import { Container, Title, Group, Button } from '@mantine/core';
import Link from 'next/link';
import classes from './Header.module.scss';

const Header = () => {
  return (
    <div className={classes.headerWrapper}>
      <Container size="lg" style={{ display: 'flex', alignItems: 'center', height: '5vh' }}>
        {/* Логотип */}
        <Title order={3} style={{ margin: 0, fontSize: 15 }}>
          <Link href="/" className={classes.logo}>
            LESH
          </Link>
        </Title>

        {/* Меню */}
        <Group style={{ margin: '0 auto', gap: 32, display: "flex" }} className={classes.menus}>
          {['Главная', 'Каталог', 'Контакты'].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`} className={classes.menuItem}>
              {item}
            </Link>
          ))}
        </Group>

        {/* Кнопка Cart */}
        <Button component={Link} href="/auth/register" variant="filled" color="orange" style={{ marginLeft: '16px' }}>
          Cart
        </Button>
      </Container>
    </div>
  );
};

export default Header;
