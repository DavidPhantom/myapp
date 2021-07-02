export const ADD_NEW_CAMERA = 'ADD_NEW_CAMERA';
export const SET_CAMERAS = 'SET_CAMERAS';
export const SET_SELECTED_CAMERA_STREAM_MUTATION = 'SET_SELECTED_CAMERA_STREAM_MUTATION';
export const UNSET_CAMERA = 'UNSET_CAMERA';
export const UPDATE_CAMERA_MUTATION = 'UPDATE_CAMERA_MUTATION';
export const SET_SELECTED_CAMERA_MUTATION = 'SET_SELECTED_CAMERA_MUTATION';
export const SET_SELECTED_CAMERA_LOADING = 'SET_SELECTED_CAMERA_LOADING';
export const SET_CAMERAS_LIMIT_ACHIEVED = 'SET_CAMERAS_LIMIT_ACHIEVED';
export const SET_MAX_CAMERAS = 'SET_MAX_CAMERAS';


export const mutations = {
    [ADD_NEW_CAMERA]: (state, camera) => {
        state.cameras.push(camera);
    },

    [SET_CAMERAS]: (state, cameras) => {
        state.cameras = cameras;
    },

    [SET_SELECTED_CAMERA_STREAM_MUTATION]: (state, camera) => {
        state.selectedCameraStream = camera;
    },

    [UNSET_CAMERA]: (state, cameraId) => {
        state.cameras = [
            ...state.cameras.filter(camera => camera.id !== cameraId),
        ];
    },

    [UPDATE_CAMERA_MUTATION]: (state, camera) => {
        state.cameras = state.cameras.map(cam => {
            if (cam.id === camera.id) {
                cam.name = camera.name;
            }

            return cam;
        });
    },

    [SET_SELECTED_CAMERA_MUTATION]: (state, camera) => {
        state.selectedCamera = camera;
    },

    [SET_SELECTED_CAMERA_LOADING]: (state, isCameraLoading) => {
        state.selectedCamera.isLoading = isCameraLoading;
    },


    [SET_CAMERAS_LIMIT_ACHIEVED]: (state, isAdd) => {
        state.camerasLimitAchieved = isAdd;
    },

    [SET_MAX_CAMERAS]: (state, maxNumCam) => {
        state.maxNumCam = maxNumCam;
    },
};
