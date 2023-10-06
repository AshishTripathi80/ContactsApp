import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("contacts.db");

const setupDatabaseAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, mobile TEXT, landline TEXT, photo TEXT, favorite INTEGER)",
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

const addContactAsync = async (name, mobile, landline, photo, favorite) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO contacts (name, mobile, landline, photo, favorite) VALUES (?, ?, ?, ?, ?)",
        [name, mobile, landline, photo, favorite],
        (_, result) => {
          resolve(result.insertId);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// ... (previous code)

const getContactsAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM contacts ORDER BY name ASC',
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

const updateContactAsync = async (id, name, mobile, landline, photo, favorite) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE contacts SET name=?, mobile=?, landline=?, photo=?, favorite=? WHERE id=?',
        [name, mobile, landline, photo, favorite, id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

const deleteContactAsync = async id => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM contacts WHERE id=?',
        [id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

export { setupDatabaseAsync, addContactAsync, getContactsAsync, updateContactAsync, deleteContactAsync };

