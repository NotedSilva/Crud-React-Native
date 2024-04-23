import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View, } from 'react-native';
import ShoppingItem from './components/ShoppingItem';
import {MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {app ,db ,getFirestore, collection, addDoc, getDocs} from "./firebase/index.js";

export default function App() {
  const [title,setTitle] = useState("");

  const [shoppingList,setShoppingList] = useState([]);

  const addShoppingItem = async () => {
    try {
      const docRef = await addDoc(collection(db, "shopping"), {
        title: title,
        isChecked: false,
      });
      console.log("Document written with ID: ", docRef.id);
      setTitle("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    getShoppingList();
  }

  const getShoppingList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "shopping"));
      const tempList = []; // Crie uma lista temporária para armazenar os itens
      querySnapshot.forEach((doc) => {
        console.log(doc.id, doc.data());
        tempList.push({ ...doc.data(), id: doc.id });
      });
      setShoppingList(tempList); 
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  useEffect(() => {
    getShoppingList();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* heading */}
          <Text style={styles.heading}>Lista de Compras</Text>
        {/* number of shopping items */}
          <Text style={styles.numberOfItems}>0</Text>
        {/* delete all */}
          <Pressable>
            <MaterialIcons name="delete" size={30} color="black" />
          </Pressable>
      </View>

      {

        shoppingList.length > 0 ?
      <FlatList
        data={shoppingList}
        renderItem={({item}) =><ShoppingItem title={item.title}/>}
        keyExtractor={item=>item.id}
      />
       : (
      <ActivityIndicator/>
    )}

      {/* text input */}
      <TextInput
      placeholder="Insira o nome do item"
      style={styles.input}
      value={title}
      onChangeText={(text) => setTitle(text)}
      onSubmitEditing={addShoppingItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    fontSize: 30,
    fontWeight: "500",
    flex: 1,

  },
  numberOfItems: {
    fontSize: 25,
    fontWeight: "500",
    marginRight: 20,
  },
  input: {
    backgroundColor: "lightgray",
    padding: 10,
    fontSize: 17,
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    marginTop: "auto",
    marginBottom: 10,
  },
});
