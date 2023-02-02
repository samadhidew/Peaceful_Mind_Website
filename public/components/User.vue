<template>
  <navbar></navbar>
  <router-view></router-view>
  <footer></footer>
</template>
<script>
import Home from "./components/Home.vue";
import sftips from "./components/sftips.vue";
import Quiz from "./components/Quiz.vue";
import navbar from "./components/navbar.vue";
import footer from "./components/footer.vue";
export default {
  components: {
    Home,
    sftips,
    Quiz,
    navbar,
    footer,
  },

  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
