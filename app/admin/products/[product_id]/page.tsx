import EditProductForm from './EditFormPage';

// Правильный тип для searchParams
interface Props {
  params: Promise<{ product_id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditProductPage({ params, searchParams }: Props) {
  const { product_id } = await params;
  const searchParamsObj = await searchParams;

  const productTypeParam = searchParamsObj['product-type']

  let productType: 'processor' | 'flashdrive';

  if (productTypeParam === 'P' || productTypeParam === 'p') {
    productType = 'processor';
  } else {
    productType = 'flashdrive';
  }


  return (
    <EditProductForm
      productId={product_id}
      typeProduct={productType}
    />
  );
}
