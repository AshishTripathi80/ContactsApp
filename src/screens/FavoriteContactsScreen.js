import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { getContactsAsync } from "../helper/database";

const FavoriteContactsScreen = () => {
  const [favoriteContacts, setFavoriteContacts] = useState([]);

  useEffect(() => {
    // Load favorite contacts from the database when the component mounts
    const loadFavoriteContacts = async () => {
      try {
        const fetchedContacts = await getContactsAsync();
        const favorites = fetchedContacts.filter(
          (contact) => contact.favorite === 1
        );
        setFavoriteContacts(favorites);
      } catch (error) {
        console.error("Error loading favorite contacts:", error);
        // Handle error (show an error message, etc.)
      }
    };

    loadFavoriteContacts();
  }, []); // Empty dependency array ensures the effect runs once after the initial render

  return (
    <View>
      <FlatList
        data={favoriteContacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Image source={{ uri: item.photo }} style={styles.contactImage} />
            <Text style={styles.contactName}>{item.name}</Text>
          </View>
        )}
      />
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
  }
});

export default FavoriteContactsScreen;
