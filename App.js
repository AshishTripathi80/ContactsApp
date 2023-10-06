import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { setupDatabaseAsync } from "./src/helper/database";

import ContactListScreen from "./src/screens/ContactListScreen";
import AddContactScreen from "./src/screens/AddContactScreen";
import FavoriteContactsScreen from "./src/screens/FavoriteContactsScreen";
import UpdateContactScreen from "./src/screens/UpdateContactScreen";

const Stack = createStackNavigator();

function App() {
  useEffect(() => {
    // Call the setup function when the component mounts
    setupDatabaseAsync()
      .then(() => {
        console.log("Database setup successful.");
      })
      .catch((error) => {
        console.error("Error setting up database:", error);
      });
  }, []); // Empty dependency array ensures the effect runs once after the initial render

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ContactListScreen">
        <Stack.Screen name="ContactListScreen" component={ContactListScreen} />
        <Stack.Screen name="AddContactScreen" component={AddContactScreen} />
        <Stack.Screen
          name="FavoriteContactsScreen"
          component={FavoriteContactsScreen}
        />
        <Stack.Screen
          name="UpdateContactScreen"
          component={UpdateContactScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
