# Curator

**Curator** is an alternative admin for [Strapi](https://www.strapi.io). It is customizable, translatable and mobile-friendly.

## Features

- 🌐 Multilingual (i18next)
- 🎨 Customizable theme (antd and Tailwind CSS)
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

| Feature              | Status |
| -------------------- | ------ |
| Collection types     | ✅     |
| Single types         | ✅     |
| Internationalization | ✅     |
| Draft / publish      | ✅     |
| Dynamic zones        | ✅     |
| User management      | ✅     |
| User profile         | ✅     |
| Permissions          | 🚧️    |
| Media library        | 🚧️    |
| Role management      | ❌     |
| API keys             | ❌     |
| Webhooks             | ❌     |
| Dark mode            | ❌     |
| Content creation     | ❌     |
