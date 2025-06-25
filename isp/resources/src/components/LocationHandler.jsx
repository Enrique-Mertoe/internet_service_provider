import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import {setLocation} from "@/utils/locationStore.js";

const LocationHandler = () => {
  const location = useLocation();

  useEffect(() => {
    setLocation(location);
  }, [location]);

  return null;
};

export default LocationHandler;
