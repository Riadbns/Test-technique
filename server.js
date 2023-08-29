// Import des configurations de l'application depuis un fichier .env
import "dotenv/config";

// Import des modules et des bibliothèques nécessaires
import https from "https"; // Module pour créer un serveur HTTPS
import { readFile } from "fs/promises"; // Module pour lire des fichiers
import express, { json } from "express"; // Framework Express pour le serveur
import helmet from "helmet"; // Module pour ajouter des en-têtes de sécurité
import compression from "compression"; // Module pour compresser les réponses
import session from "express-session"; // Middleware de gestion des sessions
import memorystore from "memorystore"; // Mémoire de stockage pour les sessions
import cors from "cors"; // Middleware pour la gestion des CORS
import passport from "passport"; // Middleware d'authentification
import bodyParser from "body-parser"; // Middleware pour le corps des requêtes

import { engine } from "express-handlebars";

import { validateConnexionUser, validateInput } from "./validation.js"; // Import des fonctions de validation et d'autres fonctionnalités

import "./authentification.js"; // Configuration d'authentification avec Passport.js

import {
  getBlogUser,
  supprimBlog,
  addBlogPost,
  getBlogModifier,
  modifierBlogById,
} from "./model/blogs.js";

// Création de l'application Express
const app = express();
app.enable("trust proxy"); // Activer la confiance dans les proxies

// Configuration du moteur de vue Handlebars
app.engine("handlebars", engine({})); // Création de l'engin dans Express
app.set("view engine", "handlebars"); // Mettre l'engin handlebars comme engin de rendu
app.set("views", "./views"); // Configuration de handlebars

// Création d'une instance du MemoryStore pour stocker les sessions en mémoire
const MemoryStore = memorystore(session);

// Middleware pour l'analyse des données JSON
app.use(bodyParser.json({ limit: "50mb" }));

// Middleware pour ajouter des en-têtes de sécurité aux réponses
// It adds various security-related HTTP headers to the responses to protect against common web vulnerabilities.
app.use(helmet());

// Middleware pour la compression des réponses
// This middleware compresses the response bodies before sending them to the client, which improves performance.
app.use(compression());

// Middleware pour gérer les CORS (Cross-Origin Resource Sharing)
// Cross-Origin Resource Sharing middleware allows resources on your server to be requested from a different domain, which is useful for client-side web applications.
app.use(cors());

// Middleware pour l'analyse des corps de requêtes JSON
// Another middleware for parsing JSON request bodies.
app.use(json());

// Middleware pour la gestion des sessions
app.use(
  session({
    resave: false, // Ne pas sauvegarder la session si non modifiée
    saveUninitialized: false, // Ne pas créer de session tant qu'il n'y a rien à stocker
    secret: process.env.SESSION_SECRET, // Clé secrète pour les sessions
    store: new MemoryStore({ checkPeriod: 86400000 }), // Stockage en mémoire
  })
);

// Initialisation de Passport pour l'authentification
// These middleware initialize Passport for authentication and session management.
app.use(passport.initialize());

// Utilisation de Passport pour la gestion des sessions persistantes
// These middleware initialize Passport for authentication and session management.
app.use(passport.session());

// Middleware pour servir les fichiers statiques depuis le répertoire "public"
// These middleware serve static files (like HTML, CSS, JavaScript, images) from specified directories.
app.use(express.static("public"));

// Middleware pour l'analyse des corps de requêtes URL-encoded
app.use(express.urlencoded({ extended: false }));

// Configuration de Handlebars avec des helpers personnalisés
app.engine(
  "handlebars",
  engine({
    helpers: {
      afficheDAte: (date) => {
        let d = new Date(date);
        return d.toLocaleDateString("fr-CA", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
  })
);

//*************************************************Routes pour les différentes pages de l'applicatio********************************************** */

//-----------------------------Page login--------------------------------- */
app.get("/", async (request, response, next) => {
  response.render("login", {
    titre: "Login",
    scripts: ["/js/connexion.js"],
  });
});

//-----------------------------Page Blogues--------------------------------- */
app.get("/blogs", async (request, response, next) => {
  if (!request.user) {
    response.sendStatus(403).end();
  } else {
    let blogs = await getBlogUser();
    let dataFinal = [];
    for (const element of blogs) {
      dataFinal.push({
        id_blogue: element.id_blogue,
        nom: element.nom,
        description: element.description,
        date: element.date_creation,
      });
    }

    response.render("blogs", {
      titre: "Blogues",
      scripts: ["/js/blogs.js"],
      blogs: dataFinal,
      user: request.user,
    });
  }
});

//-----------------------------Page Ajouter Blogue--------------------------------- */
app.get("/Addblog", async (request, response, next) => {
  if (!request.user) {
    response.sendStatus(403).end();
  } else {
    response.render("AddBloge", {
      titre: "Article",
      scripts: ["/js/AddBlog.js"],
      user: request.user,
    });
  }
});

//-----------------------------Page Modifier Blogue--------------------------------- */
app.get("/EditBlog", async (request, response, next) => {
  if (!request.user) {
    response.sendStatus(403).end();
  } else {
    let blog = await getBlogModifier(parseInt(request.query.id_blog));
    let data = [];
    for (const element of blog) {
      data.push({
        id: parseInt(request.query.id_blog),
        nom: element.nom,
        description: element.description,
      });
    }
    response.render("EditBlog", {
      titre: "Modifier",
      scripts: ["/js/EditBlog.js"],
      blog: data,
      user: request.user,
    });
  }
});

//-----------------------------Authentification Utilisateur--------------------------------- */
app.post("/", (request, response, next) => {
  //Validation
  if (validateConnexionUser(request.body)) {
    passport.authenticate("local", (error, user, info) => {
      if (error) {
        next(error);
      } else if (!user) {
        response.status(401).json(info);
        response.status(403).end();
      } else {
        request.logIn(user, (error) => {
          if (error) {
            next(error);
          } else {
            response.status(200).end();
          }
        });
      }
    })(request, response, next);
  } else {
    response.status(400).end();
  }
});

//-----------------------------Ajouter Blogue--------------------------------- */
app.post("/Add-blog", (request, response, next) => {
  if (!request.user) {
    response.status(403).end();
  } else {
    if (validateInput(request.body)) {
      addBlogPost(request.body.title, request.body.date, request.body.content);

      response.status(201).end();
    } else {
      response.status(400).end();
    }
  }
});

//-----------------------------Supprimer Blogue--------------------------------- */
app.route("/blogs").delete(async (request, response) => {
  if (!request.user) {
    response.status(403).end();
  } else {
    supprimBlog(request.body.id_blog);
    response.sendStatus(200);
  }
});

//-----------------------------Modifier Blogue--------------------------------- */
app.route("/EditBlog").put(async (request, response) => {
  if (!request.user) {
    response.status(403).end();
  } else {
    if (validateInput(request.body)) {
      modifierBlogById(
        request.body.id,
        request.body.title,
        request.body.content,
        request.body.date
      );
      response.sendStatus(200);
    } else {
      response.status(400).end();
    }
  }
});

//-----------------------------Route deconnexion---------------------------------
app.post("/deconnexion", function (request, response, next) {
  request.logout(function (error) {
    if (error) {
      return next(error);
    }
    response.redirect("/");
  });
});

//*************************************************Démarrage du serveur - Securité avec HTTPS ********************************************** */
if (process.env.NODE_ENV === "production") {
  app.listen(process.env.PORT);
  console.info(`Serveurs démarré:`);
  console.info(`http://localhost:${process.env.PORT}`);
} else {
  const credentials = {
    key: await readFile("./security/localhost.key"),
    cert: await readFile("./security/localhost.cert"),
  };
  https.createServer(credentials, app).listen(process.env.PORT);
  console.info(`Serveurs démarré:`);
  console.info(`https://localhost:${process.env.PORT}`);
}
