import { getCurrentLocation } from "../services/geolocation";

describe("geolocation", () => {
  describe("getCurrentLocation", () => {
    it("should alert if navigator is not available", () => {
      (window as any).navigator = undefined;
      (window as any).alert = jest.fn();

      getCurrentLocation(() => {}, () => {});

      expect((window as any).alert).toHaveBeenCalledTimes(1);
      expect((window as any).alert).toHaveBeenCalledWith(
        "This feature is not available in your device"
      );
    });

    it("should alert if navigator.geolocation is not available", () => {
      (window as any).navigator = { geolocation: undefined };
      (window as any).alert = jest.fn();

      getCurrentLocation(() => {}, () => {});

      expect((window as any).alert).toHaveBeenCalledTimes(1);
      expect((window as any).alert).toHaveBeenCalledWith(
        "This feature is not available in your device"
      );
    });
  });
});
