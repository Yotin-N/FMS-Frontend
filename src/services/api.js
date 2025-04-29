/* eslint-disable no-unused-vars */
export const loginUser = async (credentials) => {
  console.log("API Call: loginUser", credentials);

  return Promise.resolve({
    success: true,

    user: {
      id: 1,

      name: "John Doe",

      email: credentials.email,

      role: "Admin",
    },

    token: "simulated-jwt-token",
  });
};

export const registerUser = async (userData) => {
  console.log("API Call: registerUser", userData);

  return Promise.resolve({
    success: true,

    message: "User registered successfully",
  });
};

export const requestPasswordReset = async (email) => {
  console.log("API Call: requestPasswordReset", email);

  return Promise.resolve({
    success: true,

    message: "Password reset link has been sent to your email",
  });
};

export const createFarm = async (farmData) => {
  console.log("API Call: createFarm", farmData);

  return Promise.resolve({
    success: true,

    farm: {
      id: Math.floor(Math.random() * 1000) + 1,

      ...farmData,

      createdAt: new Date().toISOString(),
    },
  });
};

export const getFarms = async () => {
  console.log("API Call: getFarms");

  return Promise.resolve({
    success: true,

    farms: [
      {
        id: 1,
        name: "Green Valley Farm",
        farmType: "Crop Farm",
        area: "150",
        location: "Green Valley",
      },

      {
        id: 2,
        name: "Sunrise Orchard",
        farmType: "Orchard",
        area: "75",
        location: "Eastside County",
      },

      {
        id: 3,
        name: "Meadow View",
        farmType: "Livestock Farm",
        area: "200",
        location: "Northridge",
      },
    ],
  });
};

export const addDevice = async (deviceData) => {
  console.log("API Call: addDevice", deviceData);

  return Promise.resolve({
    success: true,

    device: {
      id: Math.floor(Math.random() * 1000) + 1,

      ...deviceData,

      status: "active",

      createdAt: new Date().toISOString(),
    },
  });
};

export const getDevices = async (farmId = null) => {
  console.log(
    "API Call: getDevices",
    farmId ? `for farm ${farmId}` : "all devices"
  );

  return Promise.resolve({
    success: true,

    devices: [
      {
        id: 1,
        name: "Moisture Sensor A",
        serialNumber: "MS001",
        deviceType: "1",
        farmId: "1",
        status: "active",
      },

      {
        id: 2,
        name: "Weather Station 1",
        serialNumber: "WS001",
        deviceType: "2",
        farmId: "1",
        status: "active",
      },

      {
        id: 3,
        name: "Irrigation Controller",
        serialNumber: "IC001",
        deviceType: "3",
        farmId: "2",
        status: "inactive",
      },
    ],
  });
};

const getToken = () => {
  return localStorage.getItem("farmToken");
};

export const setToken = (token) => {
  localStorage.setItem("farmToken", token);
};

export const removeToken = () => {
  localStorage.removeItem("farmToken");
};
