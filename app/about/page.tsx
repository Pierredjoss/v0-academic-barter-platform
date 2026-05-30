export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">L'éducation par le partage.</h1>

      <div className="mt-8 space-y-4 text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">Notre Vision</h2>
        <p>
          Le savoir est la seule ressource qui se multiplie quand on la partage. Pourtant, pour de nombreux utilisateurs,
          l’accès aux outils pédagogiques — livres spécialisés, notes de cours structurées ou matériel technique — reste
          un défi financier majeur. ɖyɔ̌ (prononcé djo) est né de cette volonté de briser les barrières économiques.
          Inspirés par les valeurs ancestrales du troc, nous avons créé une plateforme moderne où l'entraide remplace la
          transaction.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Pourquoi "ɖyɔ̌" ?</h2>
        <p>
          Le nom de notre plateforme n'est pas choisi au hasard. En langue Fon, ɖyɔ̌ signifie "changer" ou "échanger".
          C’est un rappel de nos racines béninoises et de notre ambition : transformer la manière dont les utilisateurs
          africains consomment et partagent la connaissance. Nous croyons en une éducation circulaire où rien ne se
          perd, tout se transmet.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Ce que nous construisons</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Le Troc de Ressources : Un livre de physique contre un manuel d'économie ? C'est possible.
          </li>
          <li>
            Le Partage de Compétences : Échangez une heure de tutorat en programmation contre une aide en design
            graphique.
          </li>
          <li>
            La Solidarité Communautaire : Nous connectons des milliers d'utilisateurs issus de différentes facultés et
            horizons pour créer un réseau de soutien mutuel robuste.
          </li>
        </ul>
      </div>
    </div>
  )
}
