import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getContactsAsync, deleteContactAsync } from "../helper/database";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from Expo

const ContactListItem = ({ contact, onEdit, onDelete }) => {
  return (
    <Swipeable
      renderRightActions={(progress, dragX) => {
        const trans = dragX.interpolate({
          inputRange: [0, 50, 100, 101],
          outputRange: [-100, 0, 0, 1],
        });
        return (
          <View style={styles.rightActions}>
            <TouchableOpacity onPress={onDelete}>
              <View style={styles.deleteButton}>
                <Text style={styles.buttonText}>Delete</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={onEdit}>
              <View style={styles.editButton}>
                <Text style={styles.buttonText}>Edit</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      }}
    >
      <TouchableOpacity onPress={() => onEdit(contact)}>
        <View style={styles.contactItem}>
          <Image source={{ uri: contact.photo }} style={styles.contactImage} />
          <Text style={styles.contactName}>{contact.name}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const ContactListScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadContacts = async () => {
    try {
      const fetchedContacts = await getContactsAsync();
      setContacts(fetchedContacts);
    } catch (error) {
      console.error("Error loading contacts:", error);
      // Handle error (show an error message, etc.)
    }
  };

  // Load contacts from the database when the component mounts and when the screen is focused
  useEffect(() => {
    loadContacts();
  }, []); // Empty dependency array ensures the effect runs once after the initial render

  // Refresh contacts when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadContacts();
    }, [])
  );

  const handleEditContact = (contact) => {
    navigation.navigate("UpdateContactScreen", contact);
  };

  const handleDeleteContact = async (id) => {
    try {
      await deleteContactAsync(id);
      // Refresh contacts after deletion
      loadContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
      // Handle error (show an error message, etc.)
    }
  };

  const filteredContacts = contacts
    .filter((contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort contacts by name
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search contacts..."
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
      />
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ContactListItem
            contact={item}
            onEdit={() => handleEditContact(item)}
            onDelete={() => handleDeleteContact(item.id)}
          />
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          navigation.navigate("AddContactScreen");
        }}
      >
        <Ionicons name="add" size={24} color="black" />
      </TouchableOpacity>
      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => {
            // Navigate to favorites screen
            navigation.navigate("FavoriteContactsScreen");
          }}
        >
          <Ionicons name="heart" size={24} color="black" />
          <Text style={styles.footerButtonText}>Favorites</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  contactName: {
    fontSize: 18,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    flex: 1,
  },
  editButton: {
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    flex: 1,
  },
  rightActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
  },
  addButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "white",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Shadow on Android
    zIndex: 1, // Bring the button above the list
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
  footerButtonText: {
    marginLeft: 5,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default ContactListScreen;
