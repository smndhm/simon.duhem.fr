<template>
  <h1 v-html="title"></h1>
  <h2 v-html="description"></h2>
  <ul>
    <li v-for="link in links" :key="link">
      <a :href="link.href" v-html="link.title"></a>
    </li>
  </ul>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      title: process.env.VUE_APP_TITLE,
      description: process.env.VUE_APP_DESCRIPTION
    }
  },
  computed: {
    links() {
      return process.env.VUE_APP_LINKS.split('|').map((link)=>{
        const [title, href] = link.split('@');
        return {title, href}
      })
    }
  }
};
</script>

<style lang="scss">

</style>
