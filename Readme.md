# Run fe

```
cd /fe

npm run dev
```

# Run be

```
cd /be

node index.js
```

# Set-up cicd

# Deployment

## Deploy FE

Build distribution files and deploy on `github`, `render`, `vercel`, `netflix` any site free

## Option 1: Github

### Install `gh-pages` for Deployment

- Install the `gh-pages` package as a dev dependency:

  ```
  npm install --save-dev gh-pages
  ```

- Add deployment scripts to package.json:

  ```
  "scripts": {
  "build": "vite build",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
  }

  ```

  The predeploy script builds the project, and deploy pushes the dist folder to the gh-pages branch.

  Build and Deploy the Project:

  ```
  npm run deploy
  ```

# Deploy BE

Build and deploy nodejs express to `Render` with security .env, `service-account.json`

# Domain

fe-domain = https://hoale240803.github.io/vue-google-sheet/
api = https://vue-google-sheet.vercel.app/api
