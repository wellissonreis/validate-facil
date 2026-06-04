import { useState } from 'react';
import { View } from 'react-native';
import FloatingInput from '../floating-input/FloatingInput';
import styles from './Style';

export default function Section() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <FloatingInput
        autoComplete="email"
        icon="email"
        keyboardType="email-address"
        label="E-mail"
        onChangeText={setEmail}
        textContentType="emailAddress"
        value={email}
      />
      <FloatingInput
        autoComplete="password"
        icon="lock"
        label="Senha"
        onChangeText={setPassword}
        secureTextEntry
        textContentType="password"
        value={password}
      />
    </View>
  );
}
