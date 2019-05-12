import { detectZone } from "../services/zone";

describe("Zones", () => {
  describe("B", () => {
    it("should detect zone B between Tapiola and Lauttasaari", () => {
      expect(detectZone([24.759276, 60.159171])).toBe("B");
    });
    it("should detect zone B for Aalto university", () => {
      expect(detectZone([24.825716, 60.187741])).toBe("B");
    });
    it("should detect zone B for Puistola in the inner edge of B and C", () => {
      expect(detectZone([25.047454, 60.271097])).toBe("B");
    });
  });
  describe("A", () => {
    it("should detect zone A for Ruoholahti", () => {
      expect(detectZone([24.915668, 60.162614])).toBe("A");
    });
  });
  describe("C", () => {
    it("should detect zone C for Soukka", () => {
      expect(detectZone([24.673415, 60.142195])).toBe("C");
    });
    it("should detect zone C for Tikkurila on the inner edge of C and B", () => {
      expect(detectZone([25.038163, 60.292933])).toBe("C");
    });
  });
  describe("D", () => {
    it("should detect zone D for Kirkkonummi", () => {
      expect(detectZone([24.468068, 60.123649])).toBe("D");
    });
    it("should detect zone D for Savio", () => {
      expect(detectZone([25.102167, 60.378664])).toBe("D");
    });
    it("should detect zone D for eastern part of Helsinki after Sipoo", () => {
      expect(detectZone([25.306136, 60.389771])).toBe("D");
    });
  });
});
