import {userStore} from "@/stores";
import {Button, Modal, PinInput, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ModalProps {
  codeModalOpen: boolean;
  setCodeModalOpen: (state: boolean) => void;
  email: string
}

export default function VerifyCodeModal({codeModalOpen, setCodeModalOpen, email}: ModalProps) {
  const [code, setCode] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  const router = useRouter()

  return (
    <Modal
      opened={codeModalOpen}
      onClose={() => setCodeModalOpen(false)}
      title="Подтверждение"
      centered
      overlayProps={{
        blur: 3
      }}
      c={'black'}
      styles={{
        header: {
          backgroundColor: '#eee',
          display: 'flex',          // нужен flex
          justifyContent: 'center', // центрируем контент
        },
        title: {
          fontFamily: 'var(--font-inter)',
          fontWeight: 700,
          fontSize: 30,
          marginLeft: 20,
          // marginTop: 20// убираем лишние маргины
        },
        body: {
          padding: '20px',          // паддинг для контента
          backgroundColor: '#eee',
        },
      }}
  >
      <Stack>
        <Text
          size="md"
          ta="center"
          styles={{
            root: {
              width: '100%',         // контейнер на всю ширину модалки
              display: 'flex',
              justifyContent: 'center', // центрируем содержимое
            },
          }}
        >
                      <span style={{ maxWidth: 350, display: 'block' }}>
                        Введите код подтверждения, отправленный вам на почту
                      </span>
        </Text>

        <PinInput
          length={6}
          value={code}
          onChange={setCode}
          oneTimeCode
          size="lg"
          c={'black'}
          inputMode="numeric"
          type="number"
          styles={{
            root: {
              display: 'flex',
              justifyContent: 'center', // Центрируем все ячейки
              gap: '10px',              // Расстояние между ячейками
            },
            input: {
              backgroundColor: 'white',
              borderColor: 'gray',
              borderRadius: 8,
              width: 50,
              height: 50,
              fontSize: 24,
              textAlign: 'center',
              color: '#000',
            },
          }}
        />

        <Button
          mt="md"
          size="lg"
          bg={'#262626'}
          fw={500}
          fz={18}
          loading={confirmLoading}
          onClick={async () => {
            try {
              setConfirmLoading(true)

              await userStore.secondFAMethod(code, email) // 👈 твой API

              setCodeModalOpen(false)
              router.push('/')

            } catch (e) {
              alert('Неверный код')
            } finally {
              setConfirmLoading(false)
            }
          }}
        >
          Подтвердить
        </Button>
      </Stack>
    </Modal>
  )
}
