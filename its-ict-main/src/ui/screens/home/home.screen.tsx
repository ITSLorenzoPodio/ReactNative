import React, { useCallback, useEffect, useState } from 'react';
import { Button, FlatList, ListRenderItem, View } from 'react-native';
import { styles } from './home.styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainParamList, Screen } from '../../navigation/types';
import Card from '../../atoms/cart/cart.atom';
import { storage } from '../../../core/storage/storage';

interface Cart {
  id: number;
  totalProducts: number; // senza usare la proprietà dall'api
  price: number;
  offer: number;
  totalQuantity: number; // filtro ascendente / discendente (.sort())
}

interface Response {
  carts: ResponseCart[];
  total: number;
  skip: number;
  limit: number;
}

interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface ResponseCart {
  id: number;
  products: Product[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

interface Props {
  navigation: NativeStackNavigationProp<MainParamList, Screen.Home>;
}

enum FilterType {
  initial = 'initial',
  ascending = 'ascending',
  descending = 'descending',
}

const HomeScreen = ({ navigation }: Props) => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [responseCarts, setResponseCarts] = useState<Cart[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const PREFERRED_CARTS = 'favorite_carts';

  // Per default il filtro è impostato su 'initial'
  const [filterType, setFilterType] = useState<FilterType>(FilterType.initial);

  // ** CALLBACKS ** //
  const onFilterApply = useCallback(
    (type: FilterType) => {
      setFilterType(type);
      if (type === FilterType.initial) {
        // Per resettare i carrelli devo creare una copia dell'array originale per non avere la stessa referenza
        // questo ci permette di non modificare l'array originale
        setCarts([...responseCarts]); // Reset to original carts
        return;
      }
      // Anche qui devo creare una copia dell'array originale per non avere la stessa referenza
      const sortedCarts = [...responseCarts].sort((first, second) =>
        type === FilterType.ascending
          ? first.totalQuantity - second.totalQuantity
          : second.totalQuantity - first.totalQuantity
      );
      // Qui non serve creare una copia dell'array originale perchè sto settando un nuovo array
      setCarts(sortedCarts);
    },
    [responseCarts]
  );

  const addFavorite = useCallback(
    async (item: Cart) => {
      const updatedFavorites = favoriteIds.includes(item.id)
        ? favoriteIds.filter((id) => id !== item.id)
        : [...favoriteIds, item.id];

      setFavoriteIds(updatedFavorites);
      await storage.setItem(PREFERRED_CARTS, JSON.stringify(updatedFavorites));
    },
    [favoriteIds]
  );

  const loadFavorites = useCallback(async () => {
    try {
      const storedFavorites = await storage.getItem(PREFERRED_CARTS);
      const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      setFavoriteIds(parsedFavorites);
    } catch (err) {
      console.error('Errore nel caricare i preferiti: ', err);
    }
  }, []);

  // ** USE EFFECTS ** //
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    fetch('https://dummyjson.com/carts')
      .then((res) => res.json())
      .then((response: Response) => {
        const mappedCarts = response.carts.map((cart) => ({
          id: cart.id,
          totalProducts: cart.products.length,
          price: cart.total,
          offer: cart.discountedTotal,
          totalQuantity: cart.totalQuantity,
        }));
        setResponseCarts(mappedCarts);
        setCarts(mappedCarts);
      });
  }, []);

  // ** UI COMPONENTS ** //
  const renderItem = useCallback<ListRenderItem<Cart>>(
    ({ item }) => (
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
    ),
    [addFavorite, carts, favoriteIds, navigation]
  );

  const ItemSeparatorComponent = useCallback(() => <View style={styles.itemSeparator}></View>, []);

  // Ho dovuto spostare in basso la funzione per renderizzare i bottoni perchè utilizza onFilterApply che prima era definita più in basso
  //  Questo creava un bug perché utilizzava una versione non aggiornata di onFilterApply.
  //  Questo succede perché renderFilterButtons è un callback memorizzato (tramite useCallback),
  //  e la funzione onFilterApply che utilizza non era ancora stata dichiarata al momento della sua creazione.
  // E quindi veniva passata la versione PRECEDENTE di onFilterApply che era stata creata in precedenza.

  const renderFilterButtons = useCallback(
    () => (
      <View>
        <View style={styles.container}>
          <Button title="Ascendi" onPress={() => onFilterApply(FilterType.ascending)} />
        </View>
        <View style={styles.container}>
          <Button title="Normale" onPress={() => onFilterApply(FilterType.initial)} />
        </View>
        <View style={styles.container}>
          <Button title="Discendi" onPress={() => onFilterApply(FilterType.descending)} />
        </View>
      </View>
    ),
    [onFilterApply]
  );

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={ItemSeparatorComponent}
        data={carts}
        renderItem={renderItem}
        ListHeaderComponent={renderFilterButtons}
      />
    </View>
  );
};

export default HomeScreen;
