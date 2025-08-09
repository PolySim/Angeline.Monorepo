import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Angeline Desdevises",
    short_name: "Angeline",
    dir: "ltr",
    lang: "fr",
    orientation: "portrait",
    start_url: "/?source=pwa",
    display: "standalone",
    scope: "/",
    theme_color: "#ffffff",
    background_color: "#ffffff",
    description:
      "Photographe indépendante basée à Rennes et originaire de Normandie, j'ai façonné ma pratique de la photo de façon autodidacte depuis l'adolescence. Après trois années d'étude en information et communication, je me suis dirigée vers un service civique au Club de la Presse de Bretagne. J'ai mené des missions d'éducation aux médias et côtoyé de près le monde de la presse au sens large. Mon travail s'articule essentiellement autour de la photo d'actualité et documentaire. Les questions de société sont mes sujets de prédilections. J'ai une approche diversifiée de la photographie et m'intéresse également aux thématiques de la mémoire, des origines et de la transmission, à la façon dont les récits individuels peuvent faire échos à des histoires collectives.",
    categories: ["travel", "pictures", "photography"],
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
