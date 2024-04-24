import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { db, doc, updateDoc, deleteDoc } from "../firebase/index.js";

const ShoppingItem = (props) => {
  const [isChecked, setIsChecked] = useState(props.isChecked);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(props.title); // Estado para controlar o título editado

  const updateIsChecked = async () => {
    const shoppingRef = doc(db, "shopping", props.id);

    await updateDoc(shoppingRef, {
      isChecked: isChecked,
    });
  };

  const deleteShoppingItem = async () => {
    await deleteDoc(doc(db, "shopping", props.id));
    props.getShoppingList();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updateShoppingItem(props.id, editedTitle); // Passar o novo título para a função de atualização
    setIsEditing(false);
  };

  // Função para atualizar o título do item
  const updateShoppingItem = async (id, newTitle) => {
    try {
      const shoppingRef = doc(db, "shopping", id);
      await updateDoc(shoppingRef, {
        title: newTitle,
      });
      props.getShoppingList(); // Atualizar a lista após a edição
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  useEffect(() => {
    updateIsChecked();
  }, [isChecked]);

  return (
    <View style={styles.container}>
      {/* checked icon */}
      <Pressable onPress={() => setIsChecked(!isChecked)}>
        {isChecked ? (
          <AntDesign name="checkcircle" size={24} color="black" />
        ) : (
          <AntDesign name="checkcircleo" size={24} color="black" />
        )}
      </Pressable>
      {/* shopping text */}
      {isEditing ? ( // Renderizar um TextInput para editar o nome do item se estiver em modo de edição
        <TextInput
          style={styles.editInput}
          value={editedTitle} // Usar o valor do estado do título editado
          onChangeText={setEditedTitle} // Atualizar o estado do título editado
          onSubmitEditing={handleSave}
        />
      ) : (
        <Text style={styles.title}>{props.title}</Text>
      )}
      {/* edit button */}
      {!isEditing && ( // Renderizar o botão de edição apenas se não estiver em modo de edição
        <Pressable onPress={handleEdit}>
          <MaterialIcons name="edit" size={24} color="black" />
        </Pressable>
      )}
      {/* delete button */}
      <Pressable onPress={deleteShoppingItem}>
        <MaterialIcons name="delete" size={24} color="black" />
      </Pressable>
    </View>
  )
}

export default ShoppingItem

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "lightgrey",
    justifyContent: "space-between",
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
  },
  title: {
    flex: 1,
    marginLeft: 10,
    fontSize: 17,
    fontWeight: "500",
  },
  editInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 17,
    fontWeight: "500",
    backgroundColor: "white",
  },
});
