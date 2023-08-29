// Sélectionne l'élément HTML du formulaire avec la classe "add-blog-form"
const form = document.querySelector(".add-blog-form");
// Récupère l'élément HTML du champ de titre par son ID
const title = document.getElementById("title");
// Récupère l'élément HTML du champ de contenu par son ID
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
    title: title.value, // Titre entré par l'utilisateur
    date: epochDate, // Date convertie en temps Unix
    content: content.value, // Contenu entré par l'utilisateur
  };

  // Envoie une requête POST asynchrone au serveur pour ajouter le blog
  let response = await fetch("/Add-blog", {
    method: "POST",
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
