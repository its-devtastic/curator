![Curator Logo](https://raw.githubusercontent.com/its-devtastic/curator/main/media/banner.png)

<div align="center">
  <a aria-label="Stars" href="https://github.com/its-devtastic/curator/stargazers">
    <img src="https://img.shields.io/github/stars/its-devtastic/curator">
  </a>
<a aria-label="NPM" href="https://www.npmjs.com/package/@curatorjs/core">
    <img src="https://img.shields.io/npm/dm/%40curatorjs/core
">
  </a>
</div>

---

**Curator** is an alternative admin for [Strapi](https://www.strapi.io). It is customizable, translatable and mobile-friendly.

![Preview](https://raw.githubusercontent.com/its-devtastic/curator/main/media/preview.png)

## Documentation

Documentation is available [here](https://its-devtastic.github.io/curator/).

## Features

- 🌐 Multilingual (i18next)
- 🎨 Customizable theme (antd and Tailwind)
- 🧩 Injection zones
- 🧱 Swappable components
- 📜 Custom pages
- 📱 Responsive
- 🔌 Plugins
- 💯 100% TypeScript

## Quick Start

Create a new Curator project with the Create Curator App tool:

```shell
npx create-curator-app@latest cms
```

Next, go into the newly created `cms` directory and install the dependencies. When that's done, run

```shell
npm run dev
```

Your Curator project will run on http://localhost:1338

## Motivation

Strapi is the most popular JavaScript headless CMS available but its admin is notoriously uncustomizable. Curator
provides an alternative admin that is built with React and easy to customize and extend. It uses popular frameworks and
libraries that should be familiar to many developers.

## Limitations

There are some limitations on what you can do with Curator, compared to the Strapi admin.

- ✅ = Supported
- 🚧 = Partial
- ❌ = Unsupported

| Feature              | Status                                    |
| -------------------- | ----------------------------------------- |
| Collection types     | ✅                                        |
| Single types         | ✅                                        |
| Internationalization | ✅                                        |
| Draft / publish      | ✅                                        |
| Dynamic zones        | ✅                                        |
| User management      | ✅                                        |
| User profile         | ✅                                        |
| Permissions          | ✅️                                       |
| Dark mode            | ✅                                        |
| Media library        | 🚧️ (cropping is currently not supported) |
| Role management      | ❌                                        |
| API keys             | ❌                                        |
| Webhooks             | ❌                                        |
| Content-type builder | ❌ (not planned)                          |
