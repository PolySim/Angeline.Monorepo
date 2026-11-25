<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# API Angeline

Cette API NestJS utilise TypeORM avec SQLite pour gérer les informations, catégories et images.

## Installation

```bash
pnpm install
```

## Démarrage

```bash
# Développement
pnpm start:dev

# Production
pnpm start:prod
```

**Note :** L'API fonctionne sur le port 3001 par défaut pour éviter les conflits avec le frontend qui utilise le port 3000.

## Structure de la base de données

L'API utilise trois entités principales :

### Information

- `id`: Identifiant unique (TEXT, PRIMARY KEY)
- `name`: Nom de l'information (TEXT, NOT NULL)
- `content`: Contenu de l'information (TEXT, default: '')
- `lang`: Langue de l'information (TEXT, NOT NULL)

### Category

- `id`: Identifiant unique (TEXT, PRIMARY KEY)
- `name`: Nom de la catégorie (TEXT, NOT NULL)
- `article`: Article associé (TEXT, nullable)
- `ordered`: Ordre d'affichage (INTEGER, NOT NULL)
- `disabled`: Statut désactivé (BOOLEAN, default: FALSE)

### Image

- `id`: Identifiant unique (TEXT, PRIMARY KEY)
- `name`: Nom de l'image (TEXT, NOT NULL)
- `path`: Chemin vers l'image (TEXT, NOT NULL)
- `description`: Description de l'image (TEXT, nullable)
- `category`: ID de la catégorie (TEXT, NOT NULL, FOREIGN KEY)
- `ordered`: Ordre d'affichage (INTEGER, NOT NULL)

## Endpoints API

### Information

- `GET /information` - Récupérer toutes les informations
- `GET /information/:id` - Récupérer une information par ID
- `GET /information/by-name/:name` - Récupérer les informations par nom
- `GET /information/by-lang/:lang` - Récupérer les informations par langue
- `GET /information/by-name-and-lang?name=...&lang=...` - Récupérer une information par nom et langue
- `POST /information` - Créer une nouvelle information
- `PUT /information/:id` - Mettre à jour une information
- `DELETE /information/:id` - Supprimer une information

### Category

- `GET /category` - Récupérer toutes les catégories
- `GET /category/active` - Récupérer les catégories actives
- `GET /category/with-images` - Récupérer les catégories avec leurs images
- `GET /category/:id` - Récupérer une catégorie par ID
- `GET /category/by-name/:name` - Récupérer une catégorie par nom
- `POST /category` - Créer une nouvelle catégorie
- `PUT /category/:id` - Mettre à jour une catégorie
- `PUT /category/:id/toggle-disabled` - Activer/désactiver une catégorie
- `DELETE /category/:id` - Supprimer une catégorie

### Image

- `GET /image` - Récupérer toutes les images
- `GET /image/with-category` - Récupérer les images avec leurs catégories
- `GET /image/:id` - Récupérer une image par ID
- `GET /image/by-name/:name` - Récupérer les images par nom
- `GET /image/by-category/:categoryId` - Récupérer les images par catégorie
- `POST /image` - Créer une nouvelle image
- `PUT /image/:id` - Mettre à jour une image
- `PUT /image/reorder/:categoryId` - Réorganiser les images d'une catégorie
- `DELETE /image/:id` - Supprimer une image

#### Variantes WebP v1

`GET /image/:id/variant/v1/:width` accepte un UUID et exactement `384`, `640`, `1080` ou `1600` (largeur en pixels après orientation EXIF). L'API ne génère pas de variante plus large que l'original orienté, ni de variante si l'original enregistré contient plusieurs images. Une variante peut donc manquer : sur `404`, utiliser `GET /image/:id`. Les réponses WebP sont immuables (`max-age=31536000`) et portent `X-Robots-Tag: noindex`; les erreurs ne sont pas mises en cache. `GET /image/:id/blur` sert le flou pré-calculé, sinon un flou historique déjà présent sur disque, sinon `404` (sans télécharger l’original comme miniature). Aucune conversion ne s'effectue pendant ces lectures.

Les imports multipart et par morceaux préparent les fichiers dans `IMAGE_PATH/image-variants/v1/<uuid>/`. Le lot n'est rendu visible qu'après écriture complète. Un échec de préparation ne fait pas échouer un import original déjà enregistré. Deux imports sont traités en parallèle par processus, avec huit places d'attente et une limite de 64 millions de pixels par décodage. Le multipart historique accepte jusqu'à 10 fichiers de 20 Mio chacun; l'import par morceaux accepte 100 Mio par fichier, 32 sessions et des morceaux de 64 Kio à 1 Mio (512 Kio par défaut).

Comme pour l'original, la désactivation d'une catégorie ne rend pas une image connue par UUID privée. Une suppression individuelle nettoie le lot v1. La suppression d'une catégorie supprime actuellement les lignes en cascade mais laisse les fichiers sur disque : pour ne pas les rendre accessibles après suppression, l'API vérifie encore la ligne et sa référence source lorsqu'un WebP existe. Ne pas exposer le répertoire v1 comme répertoire statique. Une réponse déjà mise en cache avant suppression ne peut pas être révoquée par l'API.

#### Backfill local et borné

Depuis la racine, créer un bac à sable sous le dossier temporaire du système et y placer uniquement une base SQLite de test ou un instantané SQLite local **cohérent**, ainsi qu'une copie des originaux (`images/img/...`). Ne jamais lancer le backfill sur une base ou un volume partagés, ni en production.

```bash
sandbox=$(mktemp -d "${TMPDIR:-/tmp}/angeline-image-backfill-XXXXXX")
# Préparer $sandbox/fixture.sqlite et $sandbox/images/img/ avant de lancer :
pnpm --filter angeline.api build
DATABASE_PATH="$sandbox/fixture.sqlite" IMAGE_PATH="$sandbox/images" \
  pnpm --filter angeline.api run image:backfill --sandbox "$sandbox" --limit 100
```

La CLI lit la base en lecture seule et traite une ligne à la fois, dans l'ordre des IDs. Relancer avec `--after <nextAfter>` jusqu'à `nextAfter: null`; la taille de page est de 1 à 500. Les lots v1 complets sont ignorés et jamais réécrits. Le code de sortie est `2` si une ligne a échoué et `1` si la commande a refusé de démarrer. Un lot existant dont la référence source a changé est signalé séparément et laissé intact, pour ne pas réutiliser une URL immuable avec de nouveaux octets.

Pour une migration, déployer l’API avant le frontend et préparer les lots à partir d’un instantané cohérent. Après vérification, transférer uniquement les répertoires v1 complets vers le volume persistant de l’API, sans écraser les lots existants ni exposer publiquement ce répertoire. Les photos pas encore migrées gardent le chemin de repli Next.js, puis leur original.

## Exemples d'utilisation

### Créer une catégorie

```bash
curl -X POST http://localhost:3001/category \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Portraits",
    "article": "Les",
    "ordered": 1
  }'
```

### Créer une information

```bash
curl -X POST http://localhost:3001/information \
  -H "Content-Type: application/json" \
  -d '{
    "name": "welcome",
    "content": "Bienvenue sur le site",
    "lang": "fr"
  }'
```

### Créer une image

```bash
curl -X POST http://localhost:3001/image \
  -H "Content-Type: application/json" \
  -d '{
    "name": "portrait1",
    "path": "/images/portrait1.jpg",
    "description": "Premier portrait",
    "category": "cat_1234567890_abc123",
    "ordered": 1
  }'
```

## Architecture

L'API suit une architecture en couches :

- **Controllers** : Gèrent les requêtes HTTP et les réponses
- **Services** : Contiennent la logique métier
- **Repositories** : Gèrent l'accès aux données avec TypeORM
- **Entities** : Définissent la structure des données
- **Types** : Définis dans le package `@repo/types`

## Configuration

La base de données SQLite est automatiquement initialisée au démarrage de l'application avec le schéma défini dans `src/db/init_db.sql`.

TypeORM est configuré avec :

- `synchronize: false` (pas de synchronisation automatique)
- `logging: true` (logs des requêtes SQL)
- Pas de migrations (utilisation du script SQL d'initialisation)
