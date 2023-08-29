// Récupère le formulaire de mise à jour de blog par son ID
const form = document.getElementById("update-blog-form");
// Récupère le champ de saisie du titre du blog par son ID
const title = document.getElementById("title");
// Récupère le champ de saisie du contenu du blog par son ID
const content = document.getElementById("content");
// Élément où afficher les messages d'erreur
let erreurConnexion = document.getElementById("erreur");
// Obtient la date et l'heure actuelles en millisecondes
const currentDate = Date.now();
// Convertit la date actuelle en valeur de temps Unix (epoch) en arrondissant vers le bas
const epochDate = Math.floor(currentDate);

// Ajoute un écouteur d'événement "submit" au formulaire
form.addEventListener("submit", async (event) => {
  // Empêche le comportement par défaut de soumission du formulaire
  event.preventDefault();

  // Crée un objet avec les données du blog à envoyer au serveur
  const blogData = {
    id: event.currentTarget.dataset.id, // ID du blog depuis l'attribut "data-id" du formulaire
    title: title.value, // Titre entré par l'utilisateur
    date: epochDate, // Date convertie en temps Unix
    content: content.value, // Contenu entré par l'utilisateur
  };

  // Envoie une requête PUT asynchrone au serveur pour mettre à jour le blog
  let response = await fetch("/EditBlog", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blogData), // Convertit les données en format JSON
  });
  // Si la réponse du serveur est OK (code 200), redirige vers la liste des blogs
  if (response.ok) {
    window.location.replace("/blogs");
  }
  // Si une autre erreur se produit, affiche un message d'erreur générique
  else {
    erreurConnexion.innerHTML = "Veuillez remplir tous les champs";
    erreurConnexion.style.display = "block";
  }
});
