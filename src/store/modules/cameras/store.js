import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';

export const getInitialState = () => ({
    cameras: [],
    addCameraModalIsOpened: false,
    editCameraModalIsOpened: false,
    deleteCameraModalIsOpened: false,
    selectedCamera: {
        id: null,
        name: null,
        rtsp: null,
    },
    selectedCameraStream: {
        isLoading: false,
        isOpened: false,
        name: null,
        rtsp: '',
    },
    camerasLimitAchieved: false,
    maxNumCam: 0,
});

const state = {
    ...getInitialState(),
};

export default {
    state,
    getters,
    mutations,
    actions,
};