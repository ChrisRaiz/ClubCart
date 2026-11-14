// Lets TypeScript accept stylesheet imports like `import './Header.css';`.
// Vite bundles the CSS itself; this only tells the type checker it's allowed.
declare module '*.css';
