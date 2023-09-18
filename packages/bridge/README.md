![Curator Logo](https://raw.githubusercontent.com/its-devtastic/curator/main/media/banner.png)

<div align="center">
  <a aria-label="Stars" href="https://github.com/its-devtastic/curator/stargazers">
    <img src="https://img.shields.io/github/stars/its-devtastic/curator">
  </a>
<a aria-label="NPM" href="https://www.npmjs.com/package/@curatorjs/bridge">
    <img src="https://img.shields.io/npm/dm/%40curatorjs/bridge">
  </a>
</div>

---

**Curator Bridge** connects your Next.js website with Curator Studio providing an integrated editing experience.

---

## Documentation

Documentation is available [here](https://www.curatorjs.org).

## Features

- Preview drafts
- Edit-in-Studio button
- Integrated editing (in development)
- Inline editing (in development)

## Quick Start

Add the Bridge package to your Curator Studio project:

```shell
npm install @curatorjs/bridge
```

Add the plugin to the list of Curator plugins:

```ts
// curator.config.ts
import { bridgePlugin } from "@curatorjs/bridge";

const config = {
  // Other config...
  plugins: [
    // Other plugins...
    bridgePlugin({
      /*
       * Domain of your website.
       */
      domain: "www.example.com",
    }),
  ],
};
```
