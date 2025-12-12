'use client'
import { Group, Button, Text } from '@mantine/core';
import React, { useState } from 'react';

interface CounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  // @ts-ignore
  onExtraClick?: (e) => void;
  style?: React.CSSProperties;
}

export function Counter({ value, onChange, min = 0, max = 100, onExtraClick, style }: CounterProps) {
  const increment = () => onChange(Math.min(value + 1, max));
  const decrement = () => onChange(Math.max(value - 1, min));

  return (
    <Group onClick={onExtraClick} gap={0} style={{ border: '1px solid #262626', borderRadius: 8, ...style}} h={42}>
      <Button onClick={decrement} bg={'transparent'} c={'#262626'} size="sm">−</Button>
      <Text size="lg" c={'#262626'} style={{ width: 30, textAlign: 'center' }}>
        {value}
      </Text>
      <Button onClick={increment} bg={'transparent'} c={'#262626'} size="sm">+</Button>
    </Group>
  );
}
