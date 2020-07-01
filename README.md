# Review App

> Here is a basic overview of the review app code.

## Local development setup

1. Install [Node](https://nodejs.org/en/download/)
2. Clone this repo 

From inside the project, do the following:

``` bash
# install dependencies
npm install

# serve with hot-reload at localhost:3000
npm run dev
```

## Project Setup
Individual directories have their own README files.

``` bash
├── README.md               # this file
├── assets                  # custom css/scss files
├── components              # components/partials used by pages
├── dist                    # directory for generated files
├── helpers                 # directory I added for filtering
├── jest.config.js          # jest testing config
├── jsconfig.json           # file for VS Code
├── layouts                 # layouts/wrappers for pages
├── middleware              # will use this when we begin auth
├── node_modules            # all the node stuff
├── nuxt.config.js          # nuxt config file
├── package-lock.json       # installed packages
├── package.json            # node project config file
├── pages                   # pages...nuxt automatically generates routes
├── plugins                 # custom js plugins we don't need yet
├── static                  # static files (images, etc) not handled by webpack
├── store                   # vuex store
├── stylelint.config.js     # making stuff pretty
└── test                    # jest tests
```


## Most important stuff
These are the files/directories to look at initially

### /store
the `/store` directory houses our vuex store files...if you've never used vuex before, think of it as a centralized in-memory database for the app...all of the data is handled here which simplifies troubleshooting should something get messed up.

[Store readme](./store/README.md)

---

### /layouts
the `/layouts` directory houses layout files...basically the "wrapper" files for our app. Usually the toolbar, footers and mobile menus are defined here. Every layout file has a `<nuxt />` component where nuxt injects the page from our `/pages` directory.

```html
<v-app>
  <v-app-bar />
  <v-content>
    <nuxt /> <!-- when you go to a link, nuxt sticks that page here -->
  </v-content>
</v-app>
```

[Layouts readme](./layouts/README.md)

---
