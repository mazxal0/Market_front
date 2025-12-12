import { Box, Button, Group, Image, Text } from "@mantine/core";
import {formatWithDot} from "@/utils/formatWithDot";
import {CartProduct, ProductForCatalog, ProductType} from "@/types";
import {Dispatch, SetStateAction, useEffect, useState } from "react";
import {cartStore} from "@/stores/cartStore";
import { observer } from "mobx-react-lite";
import {Counter} from "@/components/Counter/Counter";

type ProductCardCatalogProps = ProductForCatalog & {
  setIsOpenProduct: Dispatch<SetStateAction<boolean>>;
  setGlobalTypeId: Dispatch<SetStateAction<string>>;
  setGlobalType: Dispatch<SetStateAction<ProductType | null>>;
}

function ProductCardCatalog({
  id,
                                             productType,
                                             image_url,
  name,
                                             retail_price,
                                             wholesale_price,
                                             setIsOpenProduct,
                                             setGlobalTypeId,
                                             setGlobalType
}: ProductCardCatalogProps) {

  const onClickButtonDetails = () => {
    setIsOpenProduct(prev => !prev)
    setGlobalTypeId(id)
    setGlobalType(productType)
  }

  const isCartingItem = cartStore.items.find(i => i.product_id === id);

  return (
    <Box w={300} onClick={onClickButtonDetails}>
      <Image alt={name} src={image_url} width={300} height={245} radius={16}/>
      <Text fw={600} fz={20} c={'#000000'} mt={15}>{name}</Text>
      <Group gap={5} mt={10}>
        <Text fw={500} fz={20} c={'#000000'}>{formatWithDot(retail_price)}р</Text>
        <Text fw={500} fz={20} c={'#0D6EFD'}>/</Text>
        <Text fw={500} fz={20} c={'#000000'}>{formatWithDot(wholesale_price)}р</Text>
      </Group>
      <Group justify={'space-between'} mt={10}>

        {!isCartingItem ? <Button onClick={async (e) => {
          e.stopPropagation();  // предотвращаем всплытие
          await cartStore.addItem(id, productType, 1)
        }} size={'md'} fw={500} fz={18} radius={8} c={'#262626'} bg={'transparent'}
                 style={{border: '1px solid #262626'}}>
          В корзину
        </Button> : <Counter onExtraClick={(e) => e.stopPropagation()} value={isCartingItem.quantity} onChange={(newValue: number) => cartStore.changeQuantity(isCartingItem.id, newValue)}/>}

        <Button onClick={(e) => {
          e.stopPropagation();
          onClickButtonDetails(); // теперь срабатывает корректно
        }} size={'md'} fw={500} fz={18} radius={8} c={'#262626'} bg={'transparent'} style={{ border: '1px solid #262626'}}>
          Подробнее
        </Button>
      </Group>
    </Box>
  )
}

export default observer(ProductCardCatalog)
