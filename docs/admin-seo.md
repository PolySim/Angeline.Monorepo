# Administration et référencement

## Parcours administrateur

- La navigation commune donne accès aux reportages, à leur ordre, à l’accueil et à la biographie. « Voir le site » ouvre le site public dans un nouvel onglet.
- La liste des reportages permet de rechercher par nom et de filtrer par visibilité. Les trois rubriques permanentes ne sont ni supprimables ni masquables depuis cette liste.
- Les textes des reportages, de l’accueil et des biographies s’enregistrent explicitement. « Annuler » revient à la dernière sauvegarde réussie. Les erreurs ne doivent pas effacer la saisie.
- L’ordre des reportages se modifie par glisser-déposer ou avec les flèches, puis s’enregistre. L’ordre des photographies conserve sa sauvegarde automatique après glisser-déposer.
- L’import des photographies est séquentiel pour limiter la mémoire et les requêtes simultanées. Le compteur indique les fichiers traités ; en cas d’échec, sélectionner à nouveau les fichiers concernés.
- La modification d’une légende reste accessible sans survol. Une suppression doit être confirmée ; son dialogue reste ouvert si l’API refuse l’opération.
- Le bloc éditorial de l’accueil reste facultatif et masqué par défaut. Aucun nouveau texte promotionnel public n’est ajouté par ce correctif.

## Règles SEO

- Chaque page publique conserve sa propre URL canonique et ses propres aperçus Open Graph / Twitter.
- Les titres, descriptions et légendes s’appuient sur les contenus existants. Les coordonnées géographiques non vérifiées et la déclaration d’entreprise locale non confirmée ont été retirées des données structurées.
- Les anciennes URL de reportage (identifiant seul ou ancien titre) redirigent en HTTP 308 vers le slug actuel.
- Un reportage absent ou masqué retourne une page introuvable avec `noindex`. Ce masquage sur le site n’est **pas** un contrôle de confidentialité des fichiers de l’API.
- Le sitemap contient les pages publiques et leurs photographies, sans fausses dates de modification. Son cache est réévalué au plus tard toutes les heures et dépend des caches de catégories et d’images.
- Les liens principaux de navigation sont disponibles dans le HTML initial. Le menu utilise les catégories chargées sur le serveur, puis le cache React Query côté client.
- Les images ont des tailles responsives ; les miniatures floutées décoratives ne sont plus prioritaires ni annoncées deux fois aux lecteurs d’écran.

## Vérifications

Depuis la racine :

```sh
pnpm --filter angeline.front test
pnpm --filter angeline.front check-types
pnpm --filter angeline.front lint
pnpm --filter angeline.api test -- --runInBand
pnpm --filter angeline.api build
pnpm --filter angeline.front build
```

Le build du frontend nécessite une API joignable (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_IMAGE_URL`) et la configuration Clerk du déploiement. Fournir les clés via l’environnement, jamais dans un fichier versionné.

Les tests frontend couvrent les parcours de recherche, les erreurs de sauvegarde/suppression, la validation, les imports et les règles SEO. Ils simulent les services et l’authentification ; ils ne remplacent pas un essai avec un véritable compte administrateur.

Après déploiement :

1. Avec un compte Admin, modifier puis recharger une légende, un reportage et la biographie ; vérifier le résultat sur le site public.
2. Masquer puis réafficher un reportage ; vérifier la liste publique et sa page directe.
3. Vérifier une ancienne URL de reportage, son URL canonique et `/sitemap.xml`.
4. Soumettre le sitemap dans Google Search Console et inspecter quelques URL. Le code ne garantit ni délai d’indexation ni position dans les résultats.
