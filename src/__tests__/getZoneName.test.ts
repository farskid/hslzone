import { getZoneName } from "../utils/getZoneName";

describe("getZoneName", () => {
  it("should return '-' for 'OUT_OF_ZONES'", () => {
    expect(getZoneName("OUT_OF_ZONES")).toBe("-");
  });
  it("should return the name of the zone for zone A", () => {
    expect(getZoneName("A")).toBe("A");
  });
  it("should return the name of the zone for zone B", () => {
    expect(getZoneName("B")).toBe("B");
  });
  it("should return the name of the zone for zone C", () => {
    expect(getZoneName("C")).toBe("C");
  });
  it("should return the name of the zone for zone D", () => {
    expect(getZoneName("D")).toBe("D");
  });
});
