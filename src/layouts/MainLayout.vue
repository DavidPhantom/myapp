<template>
  <div>
    <q-layout view="hHh Lpr lff" container style="height: 100vh">
      <q-header elevated class="bg-black">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title>Header</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-drawer
        v-model="drawer"
        show-if-above
        :width="191"
        :breakpoint="700"
        elevated
        content-class="bg-primary text-white"
      >
        <q-scroll-area class="fit">
          <div class="q-pa-sm">
            <button
              class="drawer__link"
              v-for="link in linksList"
              v-bind:key="link.id"
              :data-route="link.route"
              @click="goTo"
            >
              {{ link.title }}
            </button>
          </div>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
const linksList = [
  {
    title: 'Home',
    route: '/',
    id: 0,
  },
  {
    title: 'Events',
    route: '/events',
    id: 1,
  },
  {
    title: 'Alerts',
    route: '/alerts',
    id: 2,
  },
];
export default {
  data() {
    return {
      drawer: false,
      linksList,
    };
  },
  methods: {
    goTo(e) {
      const { route } = e.target.dataset;
      this.$router.push(route);
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer__link {
  display: block;
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0em;
  color: #fff;
  text-decoration: none;
  background-color: transparent;
  cursor: pointer;
}
</style>
