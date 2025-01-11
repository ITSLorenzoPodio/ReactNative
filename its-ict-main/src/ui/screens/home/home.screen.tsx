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
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ascending);

  // ** CALLBACKS ** //

  const renderFilterButtons = useCallback(() => {
    return (
      <View>
        <View style={styles.container}>
          <Button title="Ascendi" onPress={() => onFilterApply(FilterType.ascending)}></Button>
        </View>
        <View style={styles.container}>
          <Button title="Normale" onPress={() => onFilterApply(FilterType.initial)}></Button>
        </View>
        <View style={styles.container}>
          <Button title="Discendi" onPress={() => onFilterApply(FilterType.descending)}></Button>
        </View>
      </View>
    );
  }, []);
  const onFilterApply = useCallback(
    (type: FilterType) => {
      setFilterType(type);
      if (type === FilterType.initial) {
        setCarts(responseCarts); // Deve diventare RefreshCarts()
        return;
      }
      const sortedCarts = carts.sort((first, second) => {
        if (type === FilterType.ascending) {
          return first.totalQuantity - second.totalQuantity;
        }
        return second.totalQuantity - first.totalQuantity;
      });

      setCarts(sortedCarts);
      return;
    },
    [responseCarts, carts]
  );

  const addFavorite = useCallback(
    async (item: Cart) => {
      const updatedFavorites = favoriteIds.includes(item.id)
        ? favoriteIds.filter((id) => id != item.id)
        : [...favoriteIds, item.id];

      setFavoriteIds(updatedFavorites);
      await storage.setItem(PREFERRED_CARTS, JSON.stringify(updatedFavorites));
    },
    [favoriteIds]
  );

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

  const ItemSeparatorComponent = useCallback(() => <View style={styles.itemSeparator}></View>, []);

  const loadFavorites = useCallback(async () => {
    try {
      const storedFavorites = await storage.getItem(PREFERRED_CARTS);
      const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      setFavoriteIds(parsedFavorites);
    } catch (err) {
      console.error('Errore nel caricare i preferiti: ', err);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // ** USE EFFECT ** //
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
