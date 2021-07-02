<template>
  <div class="q-pl-md q-pt-md">
    <q-btn-dropdown color="primary" label="Language" class="q-mb-md">
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

    <Smtp />
  </div>
</template>

<script>
import Smtp from './Smtp.vue';

export default {
  name: 'General',
  components: {
    Smtp,
  },
  data() {
    return {
    };
  },
  methods: {
    changeLanguage(e) {
      const lang = e.target.textContent.toLowerCase();
      localStorage.setItem('language', lang);
      this.$i18n.locale = lang;
    },
  },
};
</script>
