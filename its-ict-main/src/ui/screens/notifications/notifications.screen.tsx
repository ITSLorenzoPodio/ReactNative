import { Text, View, FlatList, ListRenderItem, Button } from "react-native";
import React, { useEffect, useState, useCallback } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainParamList, Screen } from '../../navigation/types';
import { styles } from './notifications.styles';
import { storage } from "../../../core/storage/storage";
import Card from '../../atoms/cart/cart.atom';
import { Cart } from '../home/home.screen';

interface Props {
  navigation: NativeStackNavigationProp<MainParamList, Screen.Notifications>;
}

const NotificationsScreen = ({ navigation }: Props) => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [favoriteCarts, setFavoriteCarts] = useState<Cart[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const PREFERRED_CARTS = 'favorite_carts';

  const loadFavoriteCarts = useCallback(async () => {
    try {
      const storedFavorites = await storage.getItem(PREFERRED_CARTS);
      const parsedFavoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];
      setFavoriteIds(parsedFavoriteIds);

      const response = await fetch('https://dummyjson.com/carts');
      const data = await response.json();
      const favoriteCartsData = data.carts.filter((cart: Cart) =>
        parsedFavoriteIds.includes(cart.id)
      );
      setFavoriteCarts(favoriteCartsData);
    } catch (err) {
      console.error('Error loading favorite carts: ', err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadFavoriteCarts);
    return unsubscribe;
  }, [navigation, loadFavoriteCarts]);

  const addFavorite = useCallback(
    async (item: Cart) => {
      const updatedFavorites = favoriteIds.includes(item.id)
        ? favoriteIds.filter((id) => id != item.id)
        : [...favoriteIds, item.id];

      setFavoriteIds(updatedFavorites);
      await storage.setItem(PREFERRED_CARTS, JSON.stringify(updatedFavorites));
    },
    [favoriteIds]);

  const renderItem = useCallback<ListRenderItem<Cart>>(
    ({ item }) => {
      return (
        <Card
          cart={item}
          isFavorite={favoriteIds.includes(item.id)}
          onToggleFavorite={() => addFavorite(item)}
          onPress={() => {
            if (!item.id) return;
            navigation.navigate(Screen.Detail, {
              id: item.id,
              idsArray: carts.map((el) => el.id),
            });
          }}
        />
      );
    },
    [carts, navigation, favoriteIds, addFavorite]
  );

  return (
    <View style={styles.container}>
      {favoriteCarts.length === 0 ? (
        <Text>Nessun carrello</Text>
      ) : (
        <FlatList
          data={favoriteCarts}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default NotificationsScreen;