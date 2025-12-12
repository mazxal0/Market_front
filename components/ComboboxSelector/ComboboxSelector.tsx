import { useState, useRef, useEffect } from 'react';
import { Box, Paper, Text, Button, ScrollArea } from '@mantine/core';
import { ChevronDown, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectCustomProps {
  data: Option[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string | React.ReactNode;
}

export function MultiSelectCustom({ data, value, onChange, placeholder }: MultiSelectCustomProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setDropdownOpen((o) => !o);

  const handleSelect = (option: Option) => {
    if (value.includes(option.value)) {
      onChange(value.filter((v) => v !== option.value));
    } else {
      onChange([...value, option.value]);
    }
  };

  const handleRemove = (val: string) => {
    onChange(value.filter((v) => v !== val));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const borderColor = value.length > 0 && !dropdownOpen ? '#0D6EFD' : '#262626';

  return (
    <Box h={48} ref={ref} style={{ display: 'flex', alignItems: 'center', position: 'relative', borderTopLeftRadius: 16, borderTopRightRadius: 16, borderBottomRightRadius: dropdownOpen ? 0 : 16, borderBottomLeftRadius: dropdownOpen ? 0 : 16, backgroundColor: `${borderColor}`, padding: 4 }}>
      <Button
        fullWidth
        onClick={toggleDropdown}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 8px',
          background: 'transparent',
        }}
      >
        <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 4, flex: 1 }}>

            <Text c={'#EEEEEE'} fz={18} mr={5}>{placeholder || 'Выберите...'}</Text>

        </Box>
        <ChevronDown
          size={20}
          style={{
            transition: 'transform 0.2s',
            transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            position: 'relative',
            top: 1,
          }}
        />
      </Button>

      {dropdownOpen && (
        <Paper
          shadow="sm"
          style={{
            position: 'absolute',
            top: '80%',
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: '60vh',
            overflow: 'hidden',
            marginTop: 4,
          }}
        >
          <ScrollArea bg={'#262626'} style={{ height: '100%' }}>
            {data.map((option) => {
              const selected = value.includes(option.value);
              return (
                <Box
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontWeight: selected ? 700 : 400,
                  }}
                >
                  {/* Минималистичный checkbox */}
                  <Box
                    style={{
                      width: 18,
                      height: 18,
                      border: '1px solid #fff',
                      borderRadius: 2,
                      marginRight: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: selected ? '#fff' : 'transparent',
                      position: 'relative',
                    }}
                  >
                    {selected && (
                      <Box
                        style={{
                          top: 5,
                          left: 4,
                          width: 10,
                          height: 5,
                          backgroundColor: 'transparent',
                          borderLeft: '2px solid #262626',
                          borderBottom: '2px solid #262626',
                          transform: 'rotate(-45deg)',
                          position: 'absolute',
                        }}
                      />
                    )}
                  </Box>
                  <Text>{option.label}</Text>
                </Box>
              );
            })}
          </ScrollArea>
        </Paper>
      )}
    </Box>
  );
}
