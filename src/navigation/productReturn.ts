import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { ProductFlowReturnTarget, ProductsStackParamList, RootTabParamList } from './types';

type ProductsNavigation = NativeStackNavigationProp<ProductsStackParamList>;

export function returnFromProductFlow(
  navigation: ProductsNavigation,
  returnTo: ProductFlowReturnTarget = 'Products',
) {
  if (returnTo === 'Products') {
    navigation.popTo('Products');
    return;
  }

  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Products' }],
    }),
  );

  const tabsNavigation = navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();

  if (returnTo === 'Home') {
    tabsNavigation?.navigate('HomeTab', { screen: 'Home' });
    return;
  }

  tabsNavigation?.navigate('ConsultationTab', { screen: 'ProductConsultation' });
}
