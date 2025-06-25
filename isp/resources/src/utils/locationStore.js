let currentLocation = null;

export const setLocation = (location) => {
  currentLocation = location;
};

export const getLocation = () => currentLocation;
