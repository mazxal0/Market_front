import { Dropzone } from '@mantine/dropzone';
import { Text, Group, Image, Button } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useState } from 'react';

interface ImagesUploaderProps<T extends { images: File[] }> {
  form: UseFormReturnType<T>;
}

function ImagesUploader<T extends { images: File[] }>({ form }: ImagesUploaderProps<T>) {
  const maxImages = 5;

  const handleDrop = (files: File[]) => {
    const currentImages = form.values.images || [];
    const total = currentImages.length + files.length;

    const allowedFiles =
      total > maxImages ? files.slice(0, maxImages - currentImages.length) : files;

    form.setFieldValue('images', [...currentImages, ...allowedFiles] as any);
  };

  const handleRemove = (index: number) => {
    const newImages = [...form.values.images];
    newImages.splice(index, 1);
    form.setFieldValue('images', newImages as any);
  };

  return (
    <>
      <Dropzone onDrop={handleDrop} accept={['image/*']} multiple>
        <Button bg={'transparent'} style={{border: "1px solid white"}} >Перетащи файлы сюда (до {maxImages} изображений)</Button>
      </Dropzone>

      {form.values.images.length > 0 && (
        <Group gap="sm" mt="md">
          {form.values.images.map((file, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <Image
                src={URL.createObjectURL(file)}
                alt={file.name}
                width={80}
                height={80}
                radius={8}
              />
              <Button
                size="xs"
                variant="outline"
                color="red"
                style={{ position: 'absolute', top: -5, right: -5 }}
                onClick={() => handleRemove(index)}
              >
                X
              </Button>
            </div>
          ))}
        </Group>
      )}
    </>
  );
}

export default ImagesUploader;
