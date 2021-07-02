import { knex } from '@/client';

import {
  SET_MAX_CAMERAS,
  SET_CAMERAS_LIMIT_ACHIEVED,
  ADD_NEW_CAMERA,
  SET_CAMERAS,
  UNSET_CAMERA,
  SET_SELECTED_CAMERA_MUTATION,
  UPDATE_CAMERA_MUTATION,
  SET_SELECTED_CAMERA_STREAM_MUTATION,
} from './mutations';

export const FETCH_CAMERAS_LIMIT = 'cameras/fetchCamerasLimit';
export const CREATE_NEW_CAMERA = 'cameras/createNewCamera';
export const FETCH_CAMERAS = 'cameras/fetchCameras';
export const DELETE_CAMERA = 'cameras/deleteCamera';
export const UPDATE_CAMERA_ACTION = 'cameras/updateCamera';
export const SET_SELECTED_CAMERA_ACTION = 'cameras/setSelectedCamera';
export const SET_SELECTED_CAMERA_STREAM_ACTION =
  'cameras/setSelectedCameraStream';
export const CHECK_CAMERA_FOR_EXISTENCE = 'cameras/checkCameraForExistence';
export const CHECK_CAMERA_RTSP_FOR_EXISTENCE =
  'cameras/checkCameraRtspForExistence';

export const actions = {
  [FETCH_CAMERAS_LIMIT]: ({ commit }) => {
    const remote = window.require('@electron/remote');
    let maxNumCam = remote.getGlobal('licenseService').maxCamerasCount;

    commit(SET_MAX_CAMERAS, maxNumCam);

    knex('cameras')
      .count('name')
      .then(data => {
        if (!data.length) return;

        let currNumCam = data[0]['count(`name`)'];
        if (maxNumCam <= currNumCam) {
          commit(SET_CAMERAS_LIMIT_ACHIEVED, true);
        } else {
          commit(SET_CAMERAS_LIMIT_ACHIEVED, false);
        }
      });
  },

  [CREATE_NEW_CAMERA]: ({ commit }, cameraData) => {
    const { name, rtsp } = cameraData;
    knex('cameras')
      .insert({ name, rtsp })
      .then(data => {
        cameraData.id = data[0];
        commit(ADD_NEW_CAMERA, cameraData);
        const remote = window.require('@electron/remote');
        remote.getGlobal('cameras_node').cameraListChanged();
      });
  },

  [FETCH_CAMERAS]: ({ commit }) => {
    knex('cameras').then(data => {
      commit(SET_CAMERAS, data);
    });
  },

  [DELETE_CAMERA]: ({ commit }, cameraId) => {
    knex('cameras')
      .where({ id: cameraId })
      .del()
      .then(() => {
        commit(UNSET_CAMERA, cameraId);
        const remote = window.require('@electron/remote');
        remote.getGlobal('cameras_node').cameraListChanged();
      });
  },

  [UPDATE_CAMERA_ACTION]: ({ commit }, camera) => {
    knex('cameras')
      .where({ id: camera.id })
      .update({ name: camera.name, rtsp: camera.rtsp })
      .then(() => {
        commit(UPDATE_CAMERA_MUTATION, camera);
        const remote = window.require('@electron/remote');
        remote.getGlobal('cameras_node').cameraListChanged();
      });
  },

  [CHECK_CAMERA_FOR_EXISTENCE]: (context, typedCameraName) => {
    return knex('cameras')
      .where({ name: typedCameraName })
      .select();
  },

  [CHECK_CAMERA_RTSP_FOR_EXISTENCE]: (context, typedCameraRtsp) => {
    return knex('cameras')
      .where({ rtsp: typedCameraRtsp })
      .select();
  },

  [SET_SELECTED_CAMERA_ACTION]: ({ commit }, camera) => {
    commit(SET_SELECTED_CAMERA_MUTATION, camera);
  },

  [SET_SELECTED_CAMERA_STREAM_ACTION]: ({ commit }, camera) => {
    commit(SET_SELECTED_CAMERA_STREAM_MUTATION, camera);
  },
};
