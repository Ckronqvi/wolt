export const getLocationAsync = (): Promise<{
  latitude: string;
  longitude: string;
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const latitudeString = latitude.toString();
          const longitudeString = longitude.toString();

          resolve({ latitude: latitudeString, longitude: longitudeString });
        },
        (_error) => {
          reject(
            new Error(
              `Unable to retrieve location. Please check your permissions. Error: ${_error.message}`
            ),
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  });
};