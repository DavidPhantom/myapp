<template>
  <q-dialog v-model="addCameraModalWindowIsOpened">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Add camera</div>
        <q-space />
        <q-btn addCameraModalWindowIsOpened="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section align="right">
        <form
          @submit.prevent.stop="add"
          style="min-width: 240px"
        >
          <q-input
            v-model="camera.name"
            filled
            placeholder="name"
            :rules="[val => !!val || 'Name is missing']"
          />

          <q-input
            v-model="camera.rtsp"
            filled
            placeholder="rtsp"
            class="q-mt-sm"
            :rules="[val => !!val || 'Rtsp is missing']"
          />

          <q-btn label="OK" type="submit" color="primary" />
        </form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'CamerasCreator',
  data() {
    return {
      camera: {
        name: '',
        rtsp: '',
      },
      addCameraModalWindowIsOpened: false,
    };
  },
  methods: {
    add() {},
    open() {
      this.addCameraModalWindowIsOpened = true;
    },
  },
};
</script>
