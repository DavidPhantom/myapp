<template>
  <section class="settings-cameras q-pl-md q-pt-md">
    <q-btn label="Add Camera" color="primary" @click="openCreator" />

    <div class="settings-cameras__cameras row wrap">
      <div
        class="settings-cameras__cameras__camera"
        v-for="camera in cameras"
        v-bind:key="camera.id"
      >
        <div class="settings-cameras__cameras__camera__info">
          <div class="settings-cameras__cameras__camera__info__icon">
            <img :src="camera" alt="" />
          </div>

          <div class="settings-cameras__cameras__camera__info__title">
            <p>{{ camera.name }}</p>
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
  &__cameras {
    margin: 16px 0 0 0;
    &__camera {
      display: flex;
      justify-content: space-between;
      padding: 16px 17px;
      width: 230px;
      height: 56px;
      background: #f2f4f7;
      border-radius: 10px;
      margin: 0 19px 8px 0;

      &__info {
        display: flex;
        &__icon {
          img {
            margin: 0 10px 0 0;
          }
        }
      }
    }
  }
}
</style>
