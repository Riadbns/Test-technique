// Déclaration des variables en récupérant les éléments HTML par leurs ID
let nom = document.getElementById("nom"); // Champ de saisie du nom d'utilisateur
let password = document.getElementById("password"); // Champ de saisie du mot de passe
let formulaire = document.getElementById("form-connexion"); // Formulaire de connexion
let erreurConnexion = document.getElementById("erreur"); // Élément où afficher les messages d'erreur

// Ajout d'un écouteur d'événement "submit" au formulaire
formulaire.addEventListener("submit", async (event) => {
  // Empêche le comportement par défaut de soumission du formulaire
  event.preventDefault();

  // Vérifie la validité du formulaire, si non valide, arrête la soumission
  if (!formulaire.checkValidity()) {
    return;
  }

  // Crée un objet avec les données de connexion à envoyer au serveur
  const data = {
    nom: nom.value, // Nom d'utilisateur saisi
    password: password.value, // Mot de passe saisi
  };

  // Envoie une requête POST asynchrone au serveur
  let response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data), // Convertit les données en format JSON
  });

  // Si l'authentification est réussie, redirige vers la liste des blogs
  if (response.ok) {
    window.location.replace("/blogs");
  }
  // Si l'authentification échoue (statut 401), affiche un message d'erreur
  else if (response.status === 401) {
    erreurConnexion.innerHTML = "Vérifier vos informations d'identification";
    erreurConnexion.style.display = "block";
  }
  // Si une autre erreur se produit, affiche un message d'erreur générique
  else {
    erreurConnexion.innerHTML = "Veuillez remplir tous les champs";
    erreurConnexion.style.display = "block";
  }
});
