import { getZoneName } from "../utils/getZoneName";

describe("getNotificationText", () => {
  it("should return `You're out of HSL Zones support!` for 'OUT_OF_ZONES'", () => {
    expect(getZoneName("OUT_OF_ZONES")).toBe("-");
  });
  it("should return `You're in zone A` for zone A", () => {
    expect(getZoneName("A")).toBe("A");
  });
  it("should return `You're in zone B` for zone B", () => {
    expect(getZoneName("B")).toBe("B");
  });
  it("should return `You're in zone C` for zone C", () => {
    expect(getZoneName("C")).toBe("C");
  });
  it("should return `You're in zone D` for zone D", () => {
    expect(getZoneName("D")).toBe("D");
  });
});
