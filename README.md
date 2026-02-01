
# 🚗 GarageMaster Pro - Guide de Déploiement

Ce projet est une application de gestion de garage automobile avec diagnostic IA intégré.

## 🚀 Installation Locale

1.  **Clonage / Copie** : Récupérez tous les fichiers dans un dossier.
2.  **Installation** : 
    ```bash
    npm install
    ```
3.  **Clé API** : Créez un fichier `.env` à la racine :
    ```env
    API_KEY=votre_cle_gemini_ici
    ```
4.  **Lancement** :
    ```bash
    npm run dev
    ```

## 🌐 Déploiement en Production (Vercel / Netlify)

L'application est optimisée pour être déployée sur des services de cloud statiques.

### 1. Préparation
- Poussez votre code sur un dépôt **GitHub**, **GitLab** ou **Bitbucket**.

### 2. Configuration sur l'hébergeur
- Connectez votre dépôt à **Vercel** ou **Netlify**.
- **Build Command** : `npm run build`
- **Output Directory** : `dist`

### 3. Variables d'Environnement (CRUCIAL)
Dans les paramètres de votre projet sur l'interface de l'hébergeur (Environment Variables) :
- Ajoutez une clé nommée `API_KEY`.
- Collez votre clé API Google Gemini obtenue sur [Google AI Studio](https://aistudio.google.com/).

## 🛠️ Stack Technique
- **Frontend** : React 19 + TypeScript
- **Style** : Tailwind CSS
- **IA** : Google Gemini API (Modèle Flash 2.5)
- **Graphiques** : Recharts
- **Icônes** : Lucide React
