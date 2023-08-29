// Importer les modules nécessaires
import { existsSync } from "fs"; // Module de système de fichiers pour vérifier si un fichier existe
import sqlite3 from "sqlite3"; // Module SQLite pour l'interaction avec la base de données
import { open } from "sqlite"; // Module SQLite pour ouvrir une connexion à la base de données
import { hash } from "bcrypt"; // Module Bcrypt pour le hachage des mots de passe

// Constante indiquant si la base de données existe au démarrage du serveur ou non.
const IS_NEW = !existsSync(process.env.DB_FILE);

// Fonction pour créer une base de données par défaut et insérer des données fictives
const createDatabase = async (connectionPromise) => {
  // Hasher le mot de passe administrateur "admin123" pour stockage sécurisé
  let passwordHash = await hash("admin123", 10);

  // Attendre que la promesse de connexion établisse une connexion à la base de données
  let connection = await connectionPromise;

  // Requêtes SQL pour créer les tables et insérer des données fictives
  const createTablesSQL = `
  CREATE TABLE IF NOT EXISTS utilisateur(
    id_utilisateur INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS blogue(
    id_blogue INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    description TEXT NOT NULL,
    date_creation INTEGER NOT NULL
  );
`;

  const insertUserDataSQL = `
  INSERT INTO utilisateur (nom, password) VALUES 
    ("admin", ?);
`;

  const insertBlogDataSQL = `
  INSERT INTO blogue (nom, description, date_creation) VALUES
    ('Test', 'premier test', '1213243434'),
    ('Test2', 'premier test2 remier test2remier test2remier test2remier test2remier test2remier test2remier test2remier test2remier test2remier test2remier test2remier test2', '2023-08-26 08:48:59');
`;

  // Exécuter les requêtes pour créer les tables et insérer les données
  await connection.exec(createTablesSQL);
  await connection.run(insertUserDataSQL, [passwordHash]);
  await connection.exec(insertBlogDataSQL);

  // Retourner la connexion établie avec les tables et données
  return connection;
};

// Création d'une promesse de connexion à la base de données dans un fichier
let connectionPromise = open({
  filename: process.env.DB_FILE, // Utilisation du chemin du fichier de base de données depuis l'environnement
  driver: sqlite3.Database, // Utilisation du pilote SQLite pour la connexion
});

// Si le fichier de base de données n'existe pas, on crée la base de données
// et on y insère des données fictive de test.
if (IS_NEW) {
  connectionPromise = createDatabase(connectionPromise);
}

// Exportation de la promesse de connexion à la base de données
export default connectionPromise;
