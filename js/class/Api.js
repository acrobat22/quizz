export class Api {
    #rootURL = "https://quizzapi.jomoreschi.fr/api/v1/quiz";

    /**
     * Méthode privée qui génère l'URL pour le fetch
     * @param {String} category 
     * @param {Sting} niveau 
     * @returns : l'url
     */
    #makeUrl(niveau) {
        const url = new URL(this.#rootURL);
        url.searchParams.set('limit', 99)
        url.searchParams.set('difficulty', niveau);
        //console.log(url.toString())
        return url;
    }

    /**
     * Méthode asynchrone qui récupère les data de l'API
     * https://quizzapi.jomoreschi.fr/api/v1/quiz?limit=1000&difficulty=difficile
     * (cf. video https://www.youtube.com/watch?v=QKYnem6RKJ0)
     * @param {String} niveau 
     * @returns : liste des questions en fonction du niveau choisi par le user
     */
    async obtenirQuestions(niveau) {
        // Si connexion internet
        try {
            // Utilisation de cache: "no-cache", cela signifie que même 
            // si la donnée est déjà en cache, le navigateur va 
            // systématiquement demander confirmation au serveur avant 
            // de l'utiliser. Si le serveur indique que rien n'a changé 
            // (code 304), le cache sera réutilisé ; sinon, le nouveau 
            // contenu sera téléchargé et mis en cache.
            const reponse = await fetch(this.#makeUrl(niveau), {
                cache: "no-cache"
            });
            if (!reponse.ok) {
                throw new Error(`Erreur ${reponse.status}: ${reponse.statusText}`);
            }
            const questions = await reponse.json();
            return questions.quizzes;
        } catch (erreur) {
            // Utilise fichier en local si par d'internet
            // https://jsonlint.com/ [formate fichier json]
            try {
                const reponseLocale = await fetch(`./json/${niveau}.json`);
                if (!reponseLocale.ok) {
                    throw new Error(`Erreur ${reponseLocale.status}: ${reponseLocale.statusText}`);
                }
                const questions = await reponseLocale.json();
                return questions.quizzes;
            } catch (erreurLocale) {
                console.error('Échec du chargement des questions:', erreurLocale);
                throw erreurLocale;
            }
        }
    }
}
