// Importer connectionPromise depuis le fichier "connexion.js"
import connectionPromise from "./connexion.js";

// Fonction pour récupérer un utilisateur par nom
export async function getUserByNom(nom) {
  // Attendre que connectionPromise établisse une connexion à la base de données
  let connexion = await connectionPromise;
  // Exécuter une requête SQL pour récupérer un utilisateur par nom
  let user = await connexion.get(
    `SELECT  nom, password
    FROM utilisateur WHERE nom=?`,
    [nom]
  );
  return user;
}
