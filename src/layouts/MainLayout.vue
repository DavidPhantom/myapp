<template>
  <div>
    <q-layout view="hHh Lpr lff" container style="height: 100vh">
      <q-header elevated class="bg-black">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title>My app</q-toolbar-title>
          <q-bar class="q-electron-drag">
            <q-btn dense flat icon="minimize" @click="minimize" />
            <q-btn dense flat icon="close" @click="close" />
          </q-bar>
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
              {{ $t(link.title) }}
            </button>
          </div>
          <q-btn-dropdown
            unelevated no-caps
            :label="$t('language')"
            class="q-mb-sm q-mt-sm"
            color="secondary"
            dropdown-icon="keyboard_arrow_down"
          >
            <q-list>
              <q-item clickable v-close-popup @click="changeLanguage">
                <q-item-section>
                  <q-item-label>En</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="changeLanguage">
                <q-item-section>
                  <q-item-label>Ru</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
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
    title: 'home',
    route: '/',
    id: 0,
  },
  {
    title: 'events',
    route: '/events',
    id: 1,
  },
  {
    title: 'alerts',
    route: '/alerts',
    id: 2,
  },
  {
    title: 'allowList',
    route: '/allowList',
    id: 3,
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
    minimize() {
      if (process.env.MODE === 'electron') {
        window.invoke('minimize-window', '');
      }
    },
    close() {
      if (process.env.MODE === 'electron') {
        window.invoke('close-window', '');
      }
    },
    changeLanguage(e) {
      const lang = e.target.textContent.toLowerCase();
      localStorage.setItem('language', lang);
      this.$i18n.locale = lang;
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
