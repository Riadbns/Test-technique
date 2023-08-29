
const validateEntrance= (entrance) => {
    return typeof entrance === "string" && !!entrance;
};
//Retourne une valeur indiquant si tous les champs inserer dans la connection user sont valide
export const validateConnexionUser = (body) => {
  return validateEntrance(body.nom) && validateEntrance(body.password);
};

//Retourne une valeur indiquant si tous les champs inserer dans la connection user sont valide
export const validateInput = (body) => {
  return validateEntrance(body.title) && validateEntrance(body.content);
};