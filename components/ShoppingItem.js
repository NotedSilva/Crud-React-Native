import { Pressable, StyleSheet, Text, View, } from 'react-native'
import React from 'react'
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

//shopping object

/*
1. id
2. title
3. ischecked
*/

const ShoppingItem = (props) => {
  return (
    <View style={styles.container}>
      {/* checked icon */}
      <Pressable>
      <AntDesign name="checkcircleo" size={24} color="black" />
      </Pressable>
      {/* shopping text */}
        <Text style={styles.title}>{props.title}</Text>
      {/* delete button */}
      <Pressable>
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
        //marginTop: 30,
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
});