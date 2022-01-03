<template>
  <header>
    <h1 v-html="title"></h1>
    <h2 v-html="description"></h2>
  </header>
  <nav>
    <ul>
      <li v-for="link in links" :key="link">
        <a
          :href="link.href"
          :aria-label="link.description"
          v-html="link.title"
        ></a>
      </li>
    </ul>
  </nav>
</template>

<script>
import LcsCnvs from '@/services/lcs-cnvs';

export default {
  name: 'Blu',
  data() {
    return {
      title: process.env.VUE_APP_TITLE,
      description: process.env.VUE_APP_DESCRIPTION,
    };
  },
  computed: {
    links() {
      return process.env.VUE_APP_LINKS.split('|').map((link) => {
        const [title, description, href] = link.split('@');
        return { title, description, href };
      });
    },
  },
  mounted() {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)')?.matches) {
      new LcsCnvs(window);
    }
  },
};
</script>

<style lang="scss">
// Normalize
@import '../node_modules/normalize.css/normalize.css';

// Font
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;900&display=swap');

// Variables
:root {
  // Font
  --font-primary: 'Noto Sans SC', sans-serif;
  --font-size: 2rem;
  --font-weight: 400;
  --font-color: #000;
  --line-height: 1.4;
  // Display
  // Decoration
  --background-color: #fff;
  // Define variables for dark theme
}

html,
body {
  // Font
  // Display
  height: 100%;
  // Decoration
}

html {
  // Font
  font-size: 0.625rem;
  font-size: calc(1rem * 0.625);
  // Display
  // Decoration
}

body {
  // Font
  font-family: var(--font-primary);
  font-size: var(--font-size);
  font-weight: var(--font-weight);
  color: var(--font-color);
  line-height: var(--line-height);
  // Display
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  // Decoration
  background: var(--background-color);
}

main {
  // Font
  text-align: center;
  // Display
  // display: none; // TODO remove this line for canvas test
  margin: 0 3rem;
  // Decoration
}

canvas#lcs-cnvs {
  // Font
  // Display
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  // Decoration
}
</style>

<style lang="scss" scoped>
/**
  CSS structure
  // Font
  // Display
  // Decoration
 */

h1 {
  // Font
  font-size: 4rem;
  font-weight: 900;
  // Display
  // Decoration
}

h2 {
  // Font
  font-size: 2.5rem;
  font-weight: 300;
  // Display
  // Decoration
}

header,
nav {
  // Font
  // Display
  margin: 3rem 0;
  // Decoration
}

header {
  h1,
  h2 {
    // Font
    // Display
    margin: 0;
    // Decoration
  }
}

nav ul {
  // Font
  // Display
  margin: 0;
  padding: 0;
  // Decoration
  list-style: none;
  li {
    display: inline;
    a {
      // Font
      color: var(--font-color);
      text-decoration: none;
      // Display
      margin: 0 1.5rem;
      // Decoration
      &:hover {
        // Font
        text-decoration: underline;
        // Display
        // Decoration
      }
    }
  }
}
</style>
