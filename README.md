# ZKPPROOF-CREDITAPP

**Date**: March 18, 2025  
**Author**: Roberto VH [rovicher.eth](https://x.com/RoberVH)  
**Description**: Demo app for a ZKProof based validation of an employee having a wage greater that a Creditor requested minimum limit without disclosing real salary  
**Notes**: 
This demo uses Vite/ react / typescript / Tailwind. It was originally scaffolded with lovable.dev
Is server is deployed to https://server-zkproof-creditapp.onrender.com
it connects to a Sepolia Contract at 0xAd0fB84F188DF7Bb7A889FFC734739f34bBA2a14 to validate ZK Proofs


### Basic installation of  Frameworks for  app from scratch

```
pnpm create vite@latest zkproof-creditapp -- --template react-ts
pnpm install
pnpm install -D postcss autoprefixer
pnpm install -D tailwindcss@3.4.11
pnpm install react-router-dom @tanstack/react-query
pnpm install react-hook-form zod @hookform/resolvers
pnpm install lodash sonner
pnpm install -D vite-plugin-svgr
pnpm install  ethers

```

Notice tailwindcss is not last version as of march 2025, it won't work 


### Execute dev environment
 ```
 pnpm run dev
 ```

Rest of components will be downloaded and installed from the package.json 



### VITE STANDARD BOILERPLATE

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
