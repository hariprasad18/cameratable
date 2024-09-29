import axios from 'axios';

const API_BASE_URL = 'https://api-app-staging.wobot.ai/app/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Authorization: `Bearer 4ApVMIn5sTxeW7GQ5VWeWiy`,
        'Content-Type': 'application/json',
    },
});

export const fetchCameras = async () => {
    try {
        const response = await api.get('/fetch/cameras');
        return response.data.data; 
    } catch (error) {
        console.error('Error fetching camera data:', error);
        throw error; 
    }
};

export const updateCameraStatus = async (selectedCamera) => {
    if (selectedCamera) {
        const updatedStatus = selectedCamera.status === "Inactive" ? "Active" : "Inactive";
        const payload = {
            id: selectedCamera.id,
            status: updatedStatus,
        };

        try {
            const response = await api.post('/update/camera/status', payload);
            return response; 
        } catch (error) {
            console.error('Error updating camera status:', error);
            throw error; 
        }
    }
};
