import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View, Button, Image } from 'react-native';
import ShoppingItem from './components/ShoppingItem';
import { MaterialIcons } from '@expo/vector-icons';
import { launchImageLibraryAsync } from 'expo-image-picker'; // Adicionar importação para selecionar imagem
import { app, db, getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "./firebase/index.js";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase"; // Importar storage do firebase

export default function App() {
  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState(""); // Estado para controlar a quantidade
  const [imageUri, setImageUri] = useState(null); // Estado para controlar a imagem selecionada
  const [shoppingList, setShoppingList] = useState([]);

  const addShoppingItem = async () => {
    try {
      let imageUrl = null;

      if (imageUri) {
        imageUrl = await uploadImage(imageUri);
      }

      const docRef = await addDoc(collection(db, "shopping"), {
        title: title,
        quantity: quantity, // Adicionar quantidade ao documento
        imageUrl: imageUrl, // Adicionar URL da imagem ao documento
        isChecked: false,
      });
      console.log("Document written with ID: ", docRef.id);
      setTitle("");
      setQuantity("");
      setImageUri(null);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    getShoppingList();
  }

  const getShoppingList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "shopping"));
      const tempList = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, doc.data());
        tempList.push({ ...doc.data(), id: doc.id });
      });
      setShoppingList(tempList);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  const deleteShoppingList = async () => {
    const querySnapshot = await getDocs(collection(db, "shopping"));

    querySnapshot.docs.map(async (doc) => {
      await deleteDoc(doc.ref);
    });

    getShoppingList();
  }

  const updateShoppingItem = async (id) => {
    // Função de atualização pode permanecer a mesma
  };

  const pickImage = async () => {
    let result = await launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    const res = await fetch(uri);
    const blob = await res.blob();
    const storageRef = ref(storage, `images/${new Date().toISOString()}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  useEffect(() => {
    getShoppingList();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Lista de Compras</Text>
        <Text style={styles.numberOfItems}>{shoppingList.length}</Text>
        <Pressable onPress={deleteShoppingList}>
          <MaterialIcons name="delete" size={30} color="black" />
        </Pressable>
      </View>

      {shoppingList.length > 0 ?
        <FlatList
          data={shoppingList}
          renderItem={({ item }) => (
            <ShoppingItem
              title={item.title}
              quantity={item.quantity} // Passar quantidade para ShoppingItem
              imageUrl={item.imageUrl} // Passar URL da imagem para ShoppingItem
              isChecked={item.isChecked}
              id={item.id}
              getShoppingList={getShoppingList}
              updateShoppingItem={updateShoppingItem}
            />
          )}
          keyExtractor={item => item.id}
        />
        : <ActivityIndicator />
      }

      <TextInput
        placeholder="Insira o nome do item"
        style={styles.input}
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <TextInput
        placeholder="Quantidade"
        style={styles.input}
        value={quantity}
        onChangeText={(text) => setQuantity(text)}
        keyboardType="numeric"
      />
      <Button title="Escolher Imagem" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Adicionar Item" onPress={addShoppingItem} />
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
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: 10,
  }
});
