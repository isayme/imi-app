<template>
  <div id="main">
    <a-layout>
      <a-layout-header><Header /></a-layout-header>
      <a-layout-content><IMI /></a-layout-content>
      <a-layout-footer><Footer /></a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
import IMI from "./components/Imi.vue";

export default {
  components: {
    Header,
    IMI,
    Footer,
  },
};
</script>

<style>
#main {
  height: 100%;
}
</style>
