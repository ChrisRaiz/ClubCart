# ClubCart

Electron + React desktop app.

## Requirements

- Node.js 24+
- npm 10+

## Scripts

| Command            | What it does                                        |
| ------------------ | --------------------------------------------------- |
| `npm install`      | Install dependencies (also sets up lint tooling)    |
| `npm start`        | Run the app in development with live reload         |
| `npm run build`    | Build main, preload and renderer into `release/app` |
| `npm run preview`  | Run the built app                                   |
| `npm run package`  | Build an installable app into `release/build`       |
| `npm run lint`     | Check the code with ESLint + Prettier               |
| `npm run lint:fix` | Fix what ESLint + Prettier can fix automatically    |

## Project layout

```
src/
  main/          Electron main process (window, menu, IPC, product lookup)
  renderer/      React UI (screens, components, hooks, styles)
assets/          App icons and macOS entitlements used for packaging
release/app/     Packaged app's package.json and build output (dist/)
.erb/            Build and lint tooling (TypeScript compiler API tools)
```

## License

Built on [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate), MIT licensed; see [LICENSE](LICENSE).
