export const CAMERAS = 'example/getCameras';
export const SELECTED_CAMERA = 'example/getSelectedCamera';
export const SELECTED_CAMERA_STREAM = 'example/getSelectedCameraStream';
export const CAMERAS_LIMIT_ACHIVED = 'example/getCamerasLimitAchieved';
export const MAX_NUM_CAM = 'example/getMaxNumCam';
export const EDIT_CAMERA_MODAL_IS_OPENED = 'example/getEditCameraModalIsOpened';
export const ADD_CAMERA_MODAL_IS_OPENED = 'example/getAddCameraModalIsOpened';
export const DELETE_CAMERA_MODAL_IS_OPENED = 'example/getDeleteCameraModalIsOpened';


export const getters = {
    [CAMERAS]: (state) => state.cameras,
    [SELECTED_CAMERA]: (state) => state.selectedCamera,
    [SELECTED_CAMERA_STREAM]: (state) => state.selectedCameraStream,
    [CAMERAS_LIMIT_ACHIVED]: (state) => state.camerasLimitAchieved,
    [MAX_NUM_CAM]: (state) => state.maxNumCam,
    [EDIT_CAMERA_MODAL_IS_OPENED]: (state) => state.editCameraModalIsOpened,
    [ADD_CAMERA_MODAL_IS_OPENED]: (state) => state.addCameraModalIsOpened,
    [DELETE_CAMERA_MODAL_IS_OPENED]: (state) => state.deleteCameraModalIsOpened,
};
