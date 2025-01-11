import React, { memo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './cart.styles';
import { Ionicons } from '@expo/vector-icons';

// id si, total cost si, discounted si, creiamo noi la logica per totalproducts (quindi non lo prendiamo)
// e totalquantity serve per il filter (non lo vede il cliente)
// ci serve il dato che da a disposizione il valore su cui fare altre logiche
// con il map dobbiamo pensare a come fare altre logiche (??)
// nuova interfaccia nostra (con uno usestate che non usera più la ex interfaccia ma questa nuova)

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

interface Cart {
  id: number;
  products: Product[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

interface CartCardProps {
  cart: Cart;
  onPress: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const Card = ({ cart, onPress, isFavorite, onToggleFavorite }: CartCardProps) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.titleStyle}>Nu carrello</Text>
          <TouchableOpacity onPress={onToggleFavorite}>
            <Ionicons
              name={isFavorite ? 'star' : 'star-outline'}
              size={24}
              color={isFavorite ? '#FFD700' : '#000'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.containerImage}>
          <Image
            source={{
              uri: 'https://www.pngall.com/wp-content/uploads/5/Empty-Red-Shopping-Cart-PNG-Picture.png',
            }}
            style={styles.imageStyle}
          />
        </View>
        <Text style={styles.genericCardText}>Cart products: {cart.totalProducts}</Text>
        <Text style={styles.genericCardText}>
          Cart products quantity (for filter purposes): {cart.totalQuantity}
        </Text>
        <Text style={[styles.genericCardText, styles.genericCardTextSpacing]}>
          Total cost: {cart.total} $
        </Text>
      </View>

      <TouchableOpacity style={styles.buyCartButton} onPress={onPress}>
        <Text style={styles.genericCardText}>Buy with discount: {cart.discountedTotal} $</Text>
      </TouchableOpacity>
    </>
  );
};

export default memo(Card);
