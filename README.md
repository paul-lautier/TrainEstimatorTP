# Kata : Estimateur de billet de train

Notre entreprise ``TrainStroke`` a mis en place un outil afin de tarifier les billets de train en France. 

Notre algorithme est conçu pour ~~faire un max de profit~~ offrir les tarifs les plus compétitifs possibles à nos
clients en fonction de leurs revenus.

Comme cette brique était critique dans le processus, nous avons mis notre élément le plus talentueux dessus. Enfin, en plus
de tous les autres projets qu'il était déjà en train de développer (et comme c'était le plus talentueux, on lui a donné tous nos 
projets ~~les plus critiques~~). Bon, là, il est parti élever des chèvres dans le Larzac, et du coup on a besoin de quelqu'un pour 
prendre le relais. Vous.

Avouons-le, nous n'avons pas vérifié la qualité du code. Mais vous êtes des expert(e)s, n'est-ce pas ?

Au cas où, on a demandé à nos expert(e)s fonctionnels de rassembler les règles métier.

## Ce qu'on attend de vous 
* Implémenter les nouvelles fonctionnalités demandées
* Sans casser la rétrocompatibilité du système. On a déjà des clients qui utilisent notre outil, et on ne veut pas les perdre.

## Règles métiers

Notre tarificateur de billets de train prend en entrée les éléments suivants : 
* Les éléments de voyage : d'où on part, où on va, quand on part
* Les informations sur les passagers : âge à la date du voyage, cartes de réduction possédées

C'est la société qui opère les trains qui fixe le `tarif de base` du billet. Nous lui fournissons donc les informations
du voyage pour obtenir le tarif en question (via une API qu'elle nous a mis à disposition).

À partir de là, nous appliquons quelques règles.

### Typologie de passager

* Si le passager est un enfant, alors : 
  * S'il a moins d'un an à la date du voyage, c'est gratuit (en même temps, il n'aura pas de siège attribué)
  * S'il a 3 ans ou moins, c'est un tarif fixe de 9 euros
  * Jusqu'à 18 ans, il a 40% de réduction par rapport au tarif de base.
* Si le passager est un senior (>= 70ans), alors il bénéficie de 20% de réduction
* Dans tous les autres cas, c'est +20% (Hé quoi, il faut bien qu'on fasse du profit !)

### Date du voyage

On calcule la durée entre aujourd'hui et le départ et applique les modificateurs suivants :
* 30 jours avant le voyage, on applique -20% de réduction.
* Puis on applique 2% d'augmentation par jour pendant 25 jours (donc de -18% à 29 jours jusqu'à +30% à 5 jours de la date de départ)
* À moins de 5 jours du voyage, le tarif du billet double.
Ces règles ne s'appliquent pas sur les billets à prix fixe.

### Cartes de réduction

Les usagers peuvent posséder des cartes de réduction : 
* Carte `TrainStroke staff` : tous les billets sont à 1 euro 
* Carte `Senior` : valable uniquement si l'utilisateur a plus de 70 ans. 20% de réduction supplémentaire
* Carte `Couple`: valable uniquement si le voyage concerne 2 passagers majeurs. 20% de réduction sur le billet de chacun de ces passagers. Valable une seule fois !
* Carte `Mi-couple` : valable uniquement si le voyage concerne 1 passager majeur. 10% de réduction sur le voyage.

Les cartes de réduction sont cumulables si elles sont compatibles (sauf `TrainStroke Staff`). Ainsi un couple de séniors a 40% de réduction sur ses billets (plus 20% parce qu'ils sont seniors... à ce prix c'est cadeau).

## Nouvelles fonctionnalités

Deux nouvelles fonctionnalités sont nécessaires pour notre outil :
* On s'est rendu compte qu'il restait parfois des billets à écouler juste avant le départ du train, et qu'un siège vide est moins rentable qu'un siège vendu pas cher.
Par conséquent, 6 heures avant le départ, on applique une réduction de 20% sur le prix du billet (au lieu de doubler le prix du billet comme actuellement)
* La carte Famille est un nouveau concept qui nous a été demandé et fonctionne comme suit. Si un passager la possède, tous ceux qui ont le même nom de famille bénéficie de 30% de réduction. 
Pour cela, il faudra ajouter un champ `lastName` dans le passager. La carte ne s'applique pas si le nom n'est pas renseigné. 
Cette carte est non cumulable avec les autres réductions. Comme elle est plus avantageuse que les autres, elle est prioritaire sur les autres cartes.