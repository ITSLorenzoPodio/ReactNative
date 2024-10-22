import { Button, Text, View } from 'react-native';
import { ButtonComponent } from '@/components/atoms/button/button.atom';
import { useCallback, useEffect, useState } from 'react';
import { TextInputComponent } from '@/components/atoms/textInput/textInput.atom';
import { useMemo } from 'react';
import { TextInput } from 'react-native-gesture-handler';

export default function Index() {
  const [quantity, setQuantity] = useState(1);
  const [text, setText] = useState('');
  const [shownText, setShownText] = useState('');

  useEffect(() => {
    alert('Benvenuto');
  }, []);

  useEffect(() => {
    setShownText(text);
  }, [text]);

  const onChangedText = (newText: string) => {
    setText(newText);
  };

  //useMemo
  const productPrice = useMemo(() => {
    return {
      price: 30,
      quantity: quantity,
      discount: 10,
      additionalPrice: 5,
    };
  }, [quantity]);

  // ** CALLBACKS  ** //
  const onPressAddOne = () => {
    setQuantity((prevState) => prevState + 1);
  };

  const onPressRemoveOne = () => {
    setQuantity((prevState) => (prevState == 1 ? 1 : prevState - 1));
  };

  const calculatePrice = useMemo(() => {
    return {
      totalPrice:
        (productPrice.price - productPrice.discount) * quantity + productPrice.additionalPrice,
    };
  }, [quantity]);

  const incrementQuantity = useCallback(onPressAddOne, []);
  const decrementQuantity = useCallback(onPressRemoveOne, []);

  // ** UI  ** //
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
      <Text style={{ fontSize: 18, paddingVertical: 32, textAlign: 'center' }}>
        Price: ${productPrice.price}
        {'\n'}
        Discount: ${productPrice.discount}
        {'\n'}
        Quantity: {productPrice.quantity}
        {'\n'}
        Additional Price: ${productPrice.additionalPrice}
        {'\n'}
        Total: ${calculatePrice.totalPrice}
      </Text>
      <TextInput
        style={{ fontSize: 18, paddingVertical: 32, textAlign: 'center' }}
        value={text}
        onChangeText={onChangedText}
        placeholder="ciao"></TextInput>
      <Text style={{ fontSize: 18, paddingVertical: 32, textAlign: 'center' }}>{shownText}</Text>
      <ButtonComponent title="Add 1" onPress={incrementQuantity} />
      <ButtonComponent style={{ margin: 5 }} title="Remove 1" onPress={decrementQuantity} />
    </View>
  );
}
