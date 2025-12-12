'use client'
import {Button, Paper, ScrollArea, Table, Text, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';
import Link from 'next/link';

interface Message {
  ID: string;
  Name: string;
  Email: string;
  Phone: string;
  Text: string;
  CreatedAt: string;
}

export default function MessageBoard() {
  const { data } = useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data } = await api.get('/message/all');
      console.log(data.messages)
      return data.messages;
    },
  });

  return (
    <Paper p="md">
      <Title order={2}>Заявки (обращения)</Title>
      <Link href={'/admin'}>
        <Button>{"<-Назад"}</Button>
      </Link>
      <ScrollArea mt="md">
        <Table
          striped
          highlightOnHover
          style={{ borderCollapse: 'collapse', width: '100%' }}
        >
          <thead>
          <tr>
            <th style={{ border: '1px solid white' }}>Имя</th>
            <th style={{ border: '1px solid white' }}>Email</th>
            <th style={{ border: '1px solid white' }}>Телефон</th>
            <th style={{ border: '1px solid white' }}>Сообщение</th>
            <th style={{ border: '1px solid white' }}>Дата</th>
          </tr>
          </thead>
          <tbody>
          {data?.map((msg) => (
            <tr key={msg.ID}>
              <td style={{ border: '1px solid white' }}>{msg.Name}</td>
              <td style={{ border: '1px solid white' }}>{msg.Email}</td>
              <td style={{ border: '1px solid white' }}>{msg.Phone}</td>
              <td style={{ border: '1px solid white' }}>{msg.Text}</td>
              <td style={{ border: '1px solid white' }}>{new Date(msg.CreatedAt).toLocaleString()}</td>
            </tr>
          ))}
          </tbody>
        </Table>

      </ScrollArea>
    </Paper>
  );
}
