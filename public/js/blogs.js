// Sélection de tous les éléments ayant l'ID "supprimer"
let supprimerBlogs = document.querySelectorAll("#supprimer");

// Sélection de tous les éléments ayant l'ID "modifier"
let modifierBlogs = document.querySelectorAll("#modifier");

// Fonction qui envoie une requête DELETE au serveur pour supprimer un blog
const suprimmerblog = (id) => {
  // Listeners pour le clic pour inscrire a une activitie
  let data = {
    id_blog: parseInt(id),
  };
  fetch(`/blogs`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

// Ajout d'un écouteur d'événement "click" à chaque bouton de suppression
supprimerBlogs.forEach((blog) => {
  blog.addEventListener("click", (event) => {
    // Appelle la fonction de suppression avec l'ID du blog et recharge la page après
    suprimmerblog(event.currentTarget.dataset.id);
    location.reload();
  });
});

// Ajout d'un écouteur d'événement "click" à chaque bouton de modification
modifierBlogs.forEach((blog) => {
  blog.addEventListener("click", (event) => {
    // Construit l'URL de modification du blog avec l'ID du blog et redirige l'utilisateur
    let url = `/Editblog?id_blog=${event.currentTarget.dataset.id}`;
    window.location.replace(url);
  });
});
