import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { addContactAsync } from "../helper/database";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const AddContactScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [landline, setLandline] = useState("");
  const [photo, setPhoto] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage =
        result.assets && result.assets.length > 0 ? result.assets[0] : result;

      setPhoto(selectedImage.uri);
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

    const handleSaveContact = async () => {
      try {
        const newContactId = await addContactAsync(
          name,
          mobile,
          landline,
          photo,
          isFavorite ? 1 : 0
        );

        navigation.navigate("ContactListScreen");
      } catch (error) {
        console.error("Error saving contact:", error);
      }
    };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <MaterialIcons name="add-a-photo" size={34} color="black" />
      </TouchableOpacity>

      {photo && <Image source={{ uri: photo }} style={styles.image} />}

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

      {/* Buttons moved to the footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={handleToggleFavorite}
        >
          <MaterialIcons
            name={isFavorite ? "favorite" : "favorite-border"}
            size={24}
            color="black"
          />
          <Text style={styles.buttonText}>
            {isFavorite ? "Favorited" : "Add to Favorites"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={handleSaveContact}
        >
          <Ionicons name="save" size={24} color="black" />
          <Text style={styles.buttonText}>Save Contact</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    marginLeft: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1, 
    borderTopColor: "#ccc", 
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default AddContactScreen;
