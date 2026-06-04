import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import {
  Animated,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import styles from './Style';

type FloatingInputProps = TextInputProps & {
  icon: 'email' | 'lock';
  label: string;
};

const inputIcons = {
  email: { ios: 'envelope', android: 'mail', web: 'mail' },
  lock: { ios: 'lock', android: 'lock', web: 'lock' },
} as const;

export default function FloatingInput({
  icon,
  label,
  value,
  onChangeText,
  ...props
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const [labelProgress] = useState(() => new Animated.Value(value ? 1 : 0));
  const isRaised = focused || Boolean(value);

  useEffect(() => {
    Animated.timing(labelProgress, {
      toValue: isRaised ? 1 : 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [isRaised, labelProgress]);

  const labelStyle = {
    fontSize: labelProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    top: labelProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [24, 12],
    }),
  };

  return (
    <View style={[styles.inputContainer, focused && styles.inputContainerFocused]}>
      <View style={styles.icon}>
        <SymbolView
          name={inputIcons[icon]}
          size={26}
          tintColor="#60646C"
        />
      </View>
      <Animated.Text style={[styles.inputLabel, labelStyle]}>
        {label}
      </Animated.Text>
      <TextInput
        {...props}
        autoCapitalize="none"
        onBlur={(event) => {
          setFocused(false);
          props.onBlur?.(event);
        }}
        onChangeText={onChangeText}
        onFocus={(event) => {
          setFocused(true);
          props.onFocus?.(event);
        }}
        placeholder=""
        placeholderTextColor="#60646C"
        style={styles.input}
        value={value}
      />
    </View>
  );
}
