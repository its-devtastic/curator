![Curator Logo](https://raw.githubusercontent.com/its-devtastic/curator/main/media/banner.png)

<div align="center">
  <a aria-label="Stars" href="https://github.com/its-devtastic/curator/stargazers">
    <img src="https://img.shields.io/github/stars/its-devtastic/curator">
  </a>
<a aria-label="NPM" href="https://www.npmjs.com/package/@curatorjs/studio">
    <img src="https://img.shields.io/npm/dm/%40curatorjs/studio">
  </a>
</div>

---

**Curator** is an alternative admin for [Strapi](https://www.strapi.io).

---

![Preview](https://raw.githubusercontent.com/its-devtastic/curator/main/media/preview.png)

## 📜 Documentation

Documentation is available [here](https://its-devtastic.github.io/curator/).

## 💫 Features

- (Truly) customizable, mobile-friendly admin
- Content versioning\*
- Dashboard\*
- Audit logs\*
- Admin user avatars\*
- Secrets manager\*
- Autosave
- Dark mode
- Flexible plugin system

\*Requires the Curator Strapi plugin.

## Quick Start

Create a new Curator project with the Create Curator App tool:

```shell
npx create-curator-app@latest
```

Curator Studio will run on http://localhost:1338

## Motivation

Strapi is a popular headless CMS, but it's missing some basic features and its admin is notoriously uncustomizable.
Curator offers a Strapi plugin that adds those features, and an alternative admin app that is easier to customize.

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
| Filters              | ✅                                        |
| API keys             | ✅                                        |
| Webhooks             | ✅                                        |
| Media library        | 🚧️ (Cropping is currently not supported) |
| Role management      | ❌                                        |
| Content-type builder | ❌ (not planned)                          |
