import { Box, Button, Group, Image, Text } from "@mantine/core";
import {formatWithDot} from "@/utils/formatWithDot";
import {CartProduct, ProductForCatalog, ProductType} from "@/types";
import {Dispatch, SetStateAction, useEffect, useState } from "react";
import {cartStore} from "@/stores/cartStore";
import { observer } from "mobx-react-lite";
import {Counter} from "@/components/Counter/Counter";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/api/axios";


function ProductCardCatalog({
                              id,
                              productType,
                              image_url,
                              name,
                              retail_price,
                              wholesale_price,
                              procRefetch
                            }: ProductForCatalog & {procRefetch: () => void}) {
  const router = useRouter()

  const onClickButtonDetails = () => {
    router.push(`/admin/products/${id}?product-type=${productType}`);
  }

  return (
    <Box w={320} onClick={onClickButtonDetails}>
      <Image alt={name} src={image_url} width={300} height={245} radius={16}/>
      <Text fw={600} fz={20} c={'#000000'} mt={15}>{name}</Text>
      <Group gap={5} mt={10}>
        <Text fw={500} fz={20} c={'#000000'}>{formatWithDot(retail_price)}р</Text>
        <Text fw={500} fz={20} c={'#0D6EFD'}>/</Text>
        <Text fw={500} fz={20} c={'#000000'}>{formatWithDot(wholesale_price)}р</Text>
      </Group>
      <Group justify={'space-between'} mt={10}>
        <Button onClick={(e) => {
          e.stopPropagation();
          onClickButtonDetails(); // теперь срабатывает корректно
        }} size={'md'} fw={500} fz={18} radius={8} c={'#262626'} bg={'transparent'} style={{ border: '1px solid #262626'}}>
          Изменить
        </Button>
        <Button rightSection={<Trash/>} onClick={async (e) => {
          try {
            e.stopPropagation();  // предотвращаем всплытие
            await api.delete((productType === 'P' ? "/processor" : "/flash-driver") + `/${id}`)
            procRefetch()
            alert("Продукт был успешно удален!")
          } catch (e) {
            alert("Произошла ошибка")
          }
        }} size={'md'} fw={500} fz={18} radius={8} c={'#262626'} bg={'transparent'}
                style={{border: '1px solid #262626'}}>
          Удалить
        </Button>

      </Group>
    </Box>
  )
}

export default observer(ProductCardCatalog)
