import { useState } from 'react';
import { View } from 'react-native';
import FloatingInput from '../floating-input/FloatingInput';
import styles from './Style';

export default function Section() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <FloatingInput
        autoComplete="username"
        icon="user"
        keyboardType="default"
        label="Usuário"
        onChangeText={setUsername}
        textContentType="username"
        value={username}
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
