// Import des modules nécessaires
import { compare } from "bcrypt";// Module pour comparer les mots de passe hachés
import passport from "passport";// Module de gestion d'authentification
import { Strategy } from "passport-local";// Stratégie d'authentification locale
import { getUserByNom } from "./model/utilisateur.js";// Fonction pour obtenir l'utilisateur par son nom

// Configuration générale de la stratégie d'authentification
// On indique ici qu'on s'attends à ce que le client
// envoit un variable "nom" et "password" au
// serveur pour l'authentification.
let config = {
  usernameField: "nom",// Champ d'identification : nom d'utilisateur
  passwordField: "password",// Champ de mot de passe
};

// Configuration de la stratégie locale
// Configuration de quoi faire avec l'identifiant et password pour les valider
passport.use(
  new Strategy(config, async (nom, password, done) => {
    // S'il y a une erreur avec la base de données,on retourne l'erreur au serveur
    try {
      // On va chercher l'utilisateur dans la base de données avec son nom
      let user = await getUserByNom(nom);
      // Si on ne trouve pas l'utilisateur, on retourne que l'authentification a échoué avec un message
      if (!user) {
        return done(null, false, { erreur: "erreur_nom" });
      }
      // Compare le mot de passe entré avec celui haché enregistré dans la base de données
      let valide = await compare(password, user.password);
      // Si le mot de passe est incorrect, signale l'échec d'authentification
      if (!valide) {
        return done(null, false, { erreur: "erreur_password" });
      }

      // Si les informations d'identification sont valides, renvoie les informations de l'utilisateur
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Serialization de l'utilisateur pour stockage dans la session
passport.serializeUser((user, done) => {
  done(null, user.nom);// Stocke le nom d'utilisateur dans la session,lorsque l'utilisateur se connecte et réussit l'authentification
});

// Désérialization de l'utilisateur pour récupération à partir de la session
// Passport utilise cette fonction pour récupérer les informations d'utilisateur associées à la session
passport.deserializeUser(async (nom, done) => {
  try {
    let user = await getUserByNom(nom);// Récupère l'utilisateur par le nom d'utilisateur
    done(null, user);
  } catch (error) {
    done(error);
  }
});
