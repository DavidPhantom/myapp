<template>
  <section class="q-pl-md q-pt-md">
    <q-btn label="Add Camera" color="primary" @click="openCreator" />

    <div class="q-mt-md row wrap">
      <div
        class="
          settings-cameras__camera
          q-px-md q-mr-lg q-mb-sm flex
          justify-between items-center
        "
        v-for="camera in cameras"
        v-bind:key="camera.id"
      >
        <div class="flex items-center">
          <div class="q-mr-sm flex">
            <img :src="cameraIcon" alt="" />
          </div>

          <div>
            <span>{{ camera.name }}</span>
          </div>
        </div>

        <div class="row">
          <q-btn
            color="positive"
            icon-right="edit"
            no-caps
            flat
            dense
            @click="() => openEditor(camera)"
          />
          <q-btn
            color="negative"
            icon-right="delete"
            no-caps
            flat
            dense
            @click="() => removeCamera(camera)"
          />
        </div>
      </div>
    </div>

    <CamerasCreator
      ref="camerasCreator"
    />
    <CamerasEditor
      ref="camerasEditor"
    />
  </section>
</template>

<script>
import mdiDelete from 'src/assets/img/icons/mdi-delete.svg';
import mdiSettings from 'src/assets/img/icons/mdi-settings.svg';
import cameraIcon from 'src/assets/img/icons/camera.svg';
import CamerasCreator from './CamerasCreator.vue';
import CamerasEditor from './CamerasEditor.vue';

export default {
  name: 'Cameras',
  components: {
    CamerasCreator,
    CamerasEditor,
  },
  data() {
    return {
      mdiDelete,
      mdiSettings,
      cameraIcon,
      cameras: [
        {
          id: 0,
          name: 'awd',
          rtsp: '12312',
        },
        {
          id: 1,
          name: '123',
          rtsp: '12312',
        },
      ],
    };
  },
  methods: {
    openCreator() {
      this.$refs.camerasCreator.open();
    },
    openEditor(camera) {
      this.$refs.camerasEditor.open(camera);
    },
    removeCamera(selectedCamera) {
      this.cameras = [
        ...this.cameras.filter((camera) => camera.name !== selectedCamera.name),
      ];
    },
  },
};
</script>

<style lang="scss">
.settings-cameras {
  &__camera {
    width: 230px;
    height: 56px;
    background: #f2f4f7;
    border-radius: 10px;
  }
}
</style>
