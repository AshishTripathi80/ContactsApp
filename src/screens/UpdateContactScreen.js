import React, { useState } from "react";
import { View, TextInput, Button,  StyleSheet } from "react-native";
import { updateContactAsync, deleteContactAsync } from "../helper/database";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
const UpdateContactScreen = ({ route, navigation }) => {
  const {
    id,
    name: initialName,
    mobile: initialMobile,
    landline: initialLandline,
    photo: initialPhoto,
    favorite: initialFavorite,
  } = route.params;
  const [name, setName] = useState(initialName);
  const [mobile, setMobile] = useState(initialMobile);
  const [landline, setLandline] = useState(initialLandline);
  const [photo, setPhoto] = useState(initialPhoto);
  const [favorite, setFavorite] = useState(initialFavorite);

  const handleUpdateContact = async () => {
    try {
      // Validate input fields (add more validation logic as needed)

      // Call the database function to update the contact
      await updateContactAsync(
        id,
        name,
        mobile,
        landline,
        photo,
        favorite ? 1 : 0
      );

      // Navigate back to the contact list screen after updating the contact
      navigation.navigate("ContactListScreen");
    } catch (error) {
      console.error("Error updating contact:", error);
      // Handle error (show an error message, etc.)
    }
  };

  const handleDeleteContact = async () => {
    try {
      // Call the database function to delete the contact
      await deleteContactAsync(id);

      // Navigate back to the contact list screen after deleting the contact
      navigation.navigate("ContactListScreen");
    } catch (error) {
      console.error("Error deleting contact:", error);
      // Handle error (show an error message, etc.)
    }
  };

  // Function to handle image picking
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // Check if assets array is available and use the first item if it exists
      const selectedImage =
        result.assets && result.assets.length > 0 ? result.assets[0] : result;

      setPhoto(selectedImage.uri);
    }
  };

  return (
    <View style={styles.container}>
      <MaterialIcons
        name="add-a-photo"
        size={30}
        color="black"
        onPress={pickImage}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile"
        value={mobile}
        onChangeText={setMobile}
      />
      <TextInput
        style={styles.input}
        placeholder="Landline"
        value={landline}
        onChangeText={setLandline}
      />
      <View style={styles.buttonContainer}>
        <Button title="Update Contact" onPress={handleUpdateContact} />
        <MaterialIcons name="delete" size={30} onPress={handleDeleteContact} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});

export default UpdateContactScreen;
