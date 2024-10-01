import { Text, View, FlatList, ListRenderItem, Button } from 'react-native';
import { Card, cards } from '@/api/data.mock';
import { CardComponent } from '@/components/molecules/cardComponent/cardComponent.molecule';
import { useState } from 'react';
import { ButtonComponent } from '@/components/atoms/button/button.atom';
import { SafeAreaView, StyleSheet, TextInput } from 'react-native';

export default function Index() {
  const [counter, setCounter] = useState(0);
  const [tempform, setTempForm] = useState('');
  const [form, setForm] = useState('');

  // CALLBACKS //

  const onPressCounter = () => {
    setCounter((prevState) => {
      return prevState + 1;
    });
  };

  const onPressPrintForm = () => {
    setForm(tempform);
  };

  const onPressResetForm = () => {
    setForm('');
  };

  // UI //
  const renderItem: ListRenderItem<Card> = ({ item, index }) => {
    return (
      <CardComponent
        key={index}
        title={item.title}
        subTitle={item.subTitle}
        backgroundColor={item.backgroundColor}
        image={item.image}
      />
    );
  };
  const ItemSeparatorComponent = () => <View style={{ height: 16 }} />;
  const ListHeaderComponent = () => {
    return (
      <Text style={{ fontSize: 24, paddingVertical: 16, textAlign: 'center' }}>
        Le card di oggi:{' '}
      </Text>
    );
  };
  const ListFooterComponent = () => {
    return (
      <Text style={{ fontSize: 24, paddingVertical: 16, textAlign: 'center' }}>
        Fine della lista
      </Text>
    );
  };

  const ListEmptyComponent = () => {
    return (
      <Text style={{ fontSize: 24, paddingVertical: 16, textAlign: 'center' }}>
        Nessuna card da mostrare
      </Text>
    );
  };

  return (
    /*
    <FlatList
      style={{ flex: 1 }}
      bounces={false}
      data={cards}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparatorComponent}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
    /n>
    */

    <View
      style={{
        padding: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        alignContent: 'center',
        justifyContent: 'center',
      }}>
      <SafeAreaView>
        <TextInput
          style={styles.input}
          placeholder="placeholder"
          onChangeText={(text: string) => setTempForm(text)}
        />
      </SafeAreaView>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 15,
          color: '#333',
        }}>
        Testo: {form}
      </Text>
      <ButtonComponent
        title="Invia"
        onPress={onPressPrintForm}
        disabled={false}
        style={{ margin: 20, alignContent: 'center' }}
      />
      <ButtonComponent
        title="Reset"
        onPress={onPressResetForm}
        disabled={false}
        style={{ backgroundColor: 'red' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
