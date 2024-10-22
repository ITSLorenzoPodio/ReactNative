import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, Button, Pressable } from 'react-native';

//Commenti by Podio

interface Todo {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
}

const RadioButton = ({ selected, onPress }: { selected: boolean; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    style={{
      height: 24,
      width: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#000',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    {selected ? (
      <View
        style={{
          height: 12,
          width: 12,
          borderRadius: 6,
          backgroundColor: '#000',
        }}
      />
    ) : null}
  </Pressable>
);

export default function TodoList() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emptyTitleError, setEmptyTitleError] = useState(false);

  //Se l'utente riscrive dopo aver provato ad aggiungere una task senza titolo, la title textInput ritorna nera
  const onChangeTitle = (text: string) => {
    setEmptyTitleError(false);
    setTitle(text);
  };

  //Quando premo Add Task
  const addTask = useCallback(
    () => {
      //Controlla che il titolo non sia vuoto
      if (title.length < 1) {
        setEmptyTitleError(true);
        return;
      }

      //Raccoglie i dati dalla task scritta
      const newTask: Todo = {
        id: new Date().valueOf(),
        title: title,
        description: description || undefined,
        isCompleted: false,
      };

      //La setta sullo useState
      setTodoList((prev) => [...prev, newTask]);

      //Resetta le textInput
      setTitle('');
      setDescription('');
    },
    //Aggiorna usando useCallBack
    [title, description]
  );

  //Quando premo un radiobutton, uso map per convertire il TodoList.isCompleted in !isCompleted (quindi passa da uno all'altro)
  const toggleTask = useCallback((id: number) => {
    setTodoList((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo))
    );
  }, []);

  const renderItem = ({ item }: { item: Todo }) => (
    //Con pressable, non devo solo cliccare il radioButton
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
      }}
      onPress={() => toggleTask(item.id)}>
      <RadioButton selected={item.isCompleted} onPress={() => toggleTask(item.id)} />
      <View
        style={{
          marginLeft: 10,
          flex: 1,
        }}>
        <Text
          style={{
            textDecorationLine: item.isCompleted ? 'line-through' : 'none',
            color: item.isCompleted ? '#777777' : '#000000',
          }}>
          {item.title}
        </Text>
        {item.description && (
          <Text
            style={{
              textDecorationLine: item.isCompleted ? 'line-through' : 'none',
              color: item.isCompleted ? '#777777' : '#000000',
            }}>
            {item.description}
          </Text>
        )}
      </View>
    </Pressable>
  );

  return (
    //View sempre visibile, textinput per title e description, bottone per add task, Titolo e sottotitolo della lista
    <View
      style={{
        flex: 1,
        padding: 16,
      }}>
      <View
        style={{
          marginBottom: 10,
        }}>
        <TextInput
          style={{
            borderWidth: 1,
            padding: 8,
            marginBottom: 8,
            borderColor: emptyTitleError ? '#FF0000' : '#000000',
          }}
          value={title}
          onChangeText={onChangeTitle}
          placeholder="Title"
        />
        <TextInput
          style={{
            borderWidth: 1,
            padding: 8,
            marginBottom: 8,
          }}
          value={description}
          onChangeText={setDescription}
          placeholder="Description (optional)"
        />
        <Button title="Add Task" onPress={addTask} />
        <Text
          style={{
            marginTop: 5,
            fontSize: 25,
            fontWeight: 'bold',
            color: '#0E0E0E',
          }}>
          Annual hiking trip with Dad
        </Text>
        <Text
          style={{
            marginTop: 5,
            fontSize: 15,
            color: '#0E0E0E',
          }}>
          Note to self, don't forget to pack these:
        </Text>
      </View>

      <FlatList // Lista generata con le task
        data={todoList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
