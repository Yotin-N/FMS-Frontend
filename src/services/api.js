// File: src/services/api.js 



/** 

 * API service for authentication 

 */



// User authentication functions 

export const loginUser = async (credentials) => {

    console.log('API Call: loginUser', credentials);



    // In a real app, this would be an API call 

    // return await fetch('/api/auth/login', { 

    //   method: 'POST', 

    //   headers: { 'Content-Type': 'application/json' }, 

    //   body: JSON.stringify(credentials) 

    // }).then(response => response.json()); 



    // Simulated successful response 

    return Promise.resolve({

        success: true,

        user: {

            id: 1,

            name: 'John Doe',

            email: credentials.email,

            role: 'Admin'

        },

        token: 'simulated-jwt-token'

    });

};



export const registerUser = async (userData) => {

    console.log('API Call: registerUser', userData);



    // In a real app, this would be an API call 

    // return await fetch('/api/auth/register', { 

    //   method: 'POST', 

    //   headers: { 'Content-Type': 'application/json' }, 

    //   body: JSON.stringify(userData) 

    // }).then(response => response.json()); 



    // Simulated successful response 

    return Promise.resolve({

        success: true,

        message: 'User registered successfully'

    });

};



export const requestPasswordReset = async (email) => {

    console.log('API Call: requestPasswordReset', email);



    // In a real app, this would be an API call 

    // return await fetch('/api/auth/reset-password', { 

    //   method: 'POST', 

    //   headers: { 'Content-Type': 'application/json' }, 

    //   body: JSON.stringify({ email }) 

    // }).then(response => response.json()); 



    // Simulated successful response 

    return Promise.resolve({

        success: true,

        message: 'Password reset link has been sent to your email'

    });

};



/** 
 
 * API services for farm management 
 
 */



export const createFarm = async (farmData) => {

    console.log('API Call: createFarm', farmData);



    // In a real app, this would be an API call 

    // return await fetch('/api/farms', { 

    //   method: 'POST', 

    //   headers: {  

    //     'Content-Type': 'application/json', 

    //     'Authorization': `Bearer ${getToken()}` 

    //   }, 

    //   body: JSON.stringify(farmData) 

    // }).then(response => response.json()); 



    // Simulated successful response 

    return Promise.resolve({

        success: true,

        farm: {

            id: Math.floor(Math.random() * 1000) + 1,

            ...farmData,

            createdAt: new Date().toISOString()

        }

    });

};



export const getFarms = async () => {

    console.log('API Call: getFarms');



    // In a real app, this would be an API call 

    // return await fetch('/api/farms', { 

    //   method: 'GET', 

    //   headers: {  

    //     'Authorization': `Bearer ${getToken()}` 

    //   } 

    // }).then(response => response.json()); 



    // Simulated successful response 

    return Promise.resolve({

        success: true,

        farms: [

            { id: 1, name: 'Green Valley Farm', farmType: 'Crop Farm', area: '150', location: 'Green Valley' },

            { id: 2, name: 'Sunrise Orchard', farmType: 'Orchard', area: '75', location: 'Eastside County' },

            { id: 3, name: 'Meadow View', farmType: 'Livestock Farm', area: '200', location: 'Northridge' }

        ]

    });

};



/** 
 
 * API services for device management 
 
 */



export const addDevice = async (deviceData) => {

    console.log('API Call: addDevice', deviceData);



    // In a real app, this would be an API call 

    // return await fetch('/api/devices', { 

    //   method: 'POST', 

    //   headers: {  

    //     'Content-Type': 'application/json', 

    //     'Authorization': `Bearer ${getToken()}` 

    //   }, 

    //   body: JSON.stringify(deviceData) 

    // }).then(response => response.json()); 



    // Simulated successful response 

    return Promise.resolve({

        success: true,

        device: {

            id: Math.floor(Math.random() * 1000) + 1,

            ...deviceData,

            status: 'active',

            createdAt: new Date().toISOString()

        }

    });

};



export const getDevices = async (farmId = null) => {

    console.log('API Call: getDevices', farmId ? `for farm ${farmId}` : 'all devices');



    // In a real app, this would be an API call 

    // const url = farmId ? `/api/farms/${farmId}/devices` : '/api/devices'; 

    // return await fetch(url, { 

    //   method: 'GET', 

    //   headers: {  

    //     'Authorization': `Bearer ${getToken()}` 

    //   } 

    // }).then(response => response.json()); 



    // Simulated successful response 

    return Promise.resolve({

        success: true,

        devices: [

            { id: 1, name: 'Moisture Sensor A', serialNumber: 'MS001', deviceType: '1', farmId: '1', status: 'active' },

            { id: 2, name: 'Weather Station 1', serialNumber: 'WS001', deviceType: '2', farmId: '1', status: 'active' },

            { id: 3, name: 'Irrigation Controller', serialNumber: 'IC001', deviceType: '3', farmId: '2', status: 'inactive' }

        ]

    });

};



/** 
 
 * Helper functions 
 
 */



// Function to get token from local storage (would be used in a real app) 

const getToken = () => {

    return localStorage.getItem('farmToken');

};



// Function to store token in local storage (would be used in a real app) 

export const setToken = (token) => {

    localStorage.setItem('farmToken', token);

};



// Function to remove token from local storage (would be used in a real app) 

export const removeToken = () => {

    localStorage.removeItem('farmToken');

};


