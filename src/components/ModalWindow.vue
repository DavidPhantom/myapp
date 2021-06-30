<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Add alert" color="primary" @click="isOpened = true" />

    <q-dialog v-model="isOpened">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add alert</div>
          <q-space />
          <q-btn isOpened="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <slot></slot>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" @click="handleAcceptBtnClick" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'ModalWindow',
  props: {
    accept: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      isOpened: false,
    };
  },
  methods: {
    handleAcceptBtnClick() {
      const res = this.accept();

      if (res) {
        this.isOpened = false;
      }
    },
  },
};
</script>
