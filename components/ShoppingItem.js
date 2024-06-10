import { Pressable, StyleSheet, Text, TextInput, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { db, doc, updateDoc, deleteDoc } from "../firebase/index.js";

const ShoppingItem = (props) => {
  const [isChecked, setIsChecked] = useState(props.isChecked);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(props.title);

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
    await updateShoppingItem(props.id, editedTitle);
    setIsEditing(false);
  };

  const updateShoppingItem = async (id, newTitle) => {
    try {
      const shoppingRef = doc(db, "shopping", id);
      await updateDoc(shoppingRef, {
        title: newTitle,
      });
      props.getShoppingList();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  useEffect(() => {
    updateIsChecked();
  }, [isChecked]);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setIsChecked(!isChecked)}>
        {isChecked ? (
          <AntDesign name="checkcircle" size={24} color="black" />
        ) : (
          <AntDesign name="checkcircleo" size={24} color="black" />
        )}
      </Pressable>
      {isEditing ? (
        <TextInput
          style={styles.editInput}
          value={editedTitle}
          onChangeText={setEditedTitle}
          onSubmitEditing={handleSave}
        />
      ) : (
        <View style={styles.textContainer}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.quantity}>Quantidade: {props.quantity}</Text>
          {props.imageUrl && (
            <Image source={{ uri: props.imageUrl }} style={styles.image} />
          )}
        </View>
      )}
      {!isEditing && (
        <Pressable onPress={handleEdit}>
          <MaterialIcons name="edit" size={24} color="black" />
        </Pressable>
      )}
      <Pressable onPress={deleteShoppingItem}>
        <MaterialIcons name="delete" size={24} color="black" />
      </Pressable>
    </View>
  );
};

export default ShoppingItem;

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
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "500",
  },
  quantity: {
    fontSize: 14,
    color: "grey",
  },
  editInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 17,
    fontWeight: "500",
    backgroundColor: "white",
  },
  image: {
    width: 50,
    height: 50,
    marginTop: 10,
  },
});
