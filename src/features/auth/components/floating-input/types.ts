import type { TextInputProps } from 'react-native';

export type FloatingInputProps = TextInputProps & {
  icon: 'user' | 'lock';
  label: string;
};
