// Importer connectionPromise depuis le fichier "connexion.js"
import connectionPromise from "./connexion.js";

// Fonction pour récupérer tous les articles de blog
export async function getBlogUser() {
  try {
    // Attendre que connectionPromise établisse une connexion à la base de données
    let connexion = await connectionPromise;
    // Exécuter une requête SQL pour récupérer tous les articles de blog
    let resultat = await connexion.all(
      "SELECT * FROM blogue order by id_blogue"
    );
    // Mapper le résultat dans un tableau d'objets de blog et le retourner
    return resultat.map((blog) => {
      return {
        ...blog,
      };
    });
  } catch (error) {
    console.log(error);
  }
}

// Fonction pour supprimer un article de blog par ID
export async function supprimBlog(id_blog) {
  try {
    let connexion = await connectionPromise;
    // Exécuter une requête SQL pour supprimer un article de blog avec l'ID spécifié
    let resultat = await connexion.run(
      `DELETE FROM blogue 
    WHERE 
    id_blogue= ? `,
      [id_blog]
    );
    return { success: true, message: "Blog deleted successfully" };
  } catch (error) {
    console.error("Error delete blog :", error);
    return { success: false, message: "Failed to delete blog" };
  }
}

// Fonction pour ajouter un nouvel article de blog
export async function addBlogPost(title, date, content) {
  try {
    let connexion = await connectionPromise;
    // Exécuter une requête SQL pour insérer un nouvel article de blog avec titre, contenu et date
    await connexion.run(
      `INSERT INTO blogue (nom, description, date_creation)
      VALUES (?, ?, ?)`,
      [title, content, date]
    );

    return { success: true, message: "Blog post added successfully" };
  } catch (error) {
    console.error("Error adding blog post:", error);
    return { success: false, message: "Failed to add blog post" };
  }
}

// Fonction pour récupérer un article de blog en vue de sa modification par ID
export async function getBlogModifier(id) {
  try {
    let connexion = await connectionPromise;
    // Exécuter une requête SQL pour récupérer un article de blog spécifique par ID
    let resultat = await connexion.all(
      "SELECT * FROM blogue where id_blogue =? ",
      [id]
    );

    return resultat;
  } catch (error) {
    console.log(error);
  }
}

// Fonction pour modifier un article de blog par ID
export async function modifierBlogById(id, nom, description, date) {
  let connexion = await connectionPromise;
  // Exécuter une requête SQL pour mettre à jour un article de blog avec de nouvelles informations
  let resultat = await connexion.run(
    `UPDATE blogue 
    SET nom=? , description=?, date_creation=? 
    WHERE id_blogue =? `,
    [nom, description, date, id]
  );
}
