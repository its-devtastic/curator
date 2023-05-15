# Strapion

> This project is still being developed.

Strapion is an alternative Strapi admin for content creators built with React.

## Features
- 🌐 Multilingual (i18next)
- 🎨 Customizable theme (antd and tailwind)
- 🧩 Multiple injection zones
- 🧱 Swappable components
- 📜 Custom pages
- 🔌 Plugins
- 💯 100% TypeScript

## Installation

```shell
npx create-strapion-app cms
```
## Description

Strapi is the most popular JavaScript headless CMS available but its admin is notoriously uncustomizable. Strapion 
provides an alternative admin that is built with React and easy to customize and extend. It uses popular frameworks and
libraries that should be familiar to many developers.

## Limitations
- Strapion targets content creators and will not implement admin specific features such as content type creation and plugin management.
- Strapi plugins are not supported, except for the i18n and upload plugins as they are widely used.
- Strapi's custom fields are not supported (but you probably don't need them). You can easily create your own in Strapion.
