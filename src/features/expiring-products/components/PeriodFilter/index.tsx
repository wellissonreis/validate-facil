import { Pressable, Text, View } from 'react-native';

import styles from './style';
import type { PeriodFilterProps, PeriodOption } from './types';

const periods: PeriodOption[] = [7, 15, 30];

export type { PeriodOption } from './types';

export default function PeriodFilter({ selectedPeriod, onSelectPeriod }: PeriodFilterProps) {
  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        {periods.map((period) => {
          const selected = selectedPeriod === period;

          return (
            <Pressable
              key={period}
              onPress={() => onSelectPeriod(period)}
              style={({ pressed }) => [
                styles.button,
                selected && styles.selectedButton,
                pressed && !selected && styles.pressedButton,
              ]}
            >
              <Text style={[styles.buttonText, selected && styles.selectedButtonText]}>
                {period} dias
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.description}>
        Exibindo produtos que vencem em até {selectedPeriod} dias
      </Text>
    </View>
  );
}
