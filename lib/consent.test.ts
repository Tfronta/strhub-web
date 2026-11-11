import { describe, expect, it } from "vitest";
import {
  CONSENT_COUNTRIES,
  consentDefaultScript,
  consentRequired,
  initialAnalyticsStorage,
  parseConsentChoice,
} from "./consent";

describe("consentRequired", () => {
  it("asks in the EEA, the United Kingdom and Switzerland", () => {
    for (const country of ["ES", "PT", "DE", "NO", "IS", "GB", "CH"]) {
      expect(consentRequired(country)).toBe(true);
    }
  });

  it("does not ask elsewhere", () => {
    for (const country of ["AR", "BR", "US", "MX", "CL", "IN"]) {
      expect(consentRequired(country)).toBe(false);
    }
  });

  it("accepts lower case country codes", () => {
    expect(consentRequired("es")).toBe(true);
  });

  it("asks when the country is unknown", () => {
    expect(consentRequired(null)).toBe(true);
    expect(consentRequired("")).toBe(true);
  });

  it("asks everyone on preview deployments", () => {
    expect(consentRequired("AR", { askEveryone: true })).toBe(true);
  });

  it("lists the 27 EU members, 3 EEA countries, the UK and Switzerland", () => {
    expect(CONSENT_COUNTRIES.size).toBe(32);
  });
});

describe("initialAnalyticsStorage", () => {
  it("starts denied where consent is required", () => {
    expect(initialAnalyticsStorage(true, null)).toBe("denied");
  });

  it("starts granted elsewhere", () => {
    expect(initialAnalyticsStorage(false, null)).toBe("granted");
  });

  it("follows a stored choice everywhere", () => {
    expect(initialAnalyticsStorage(true, "granted")).toBe("granted");
    expect(initialAnalyticsStorage(false, "denied")).toBe("denied");
  });
});

describe("parseConsentChoice", () => {
  it("keeps only the two known values", () => {
    expect(parseConsentChoice("granted")).toBe("granted");
    expect(parseConsentChoice("denied")).toBe("denied");
    expect(parseConsentChoice("yes")).toBeNull();
    expect(parseConsentChoice(undefined)).toBeNull();
  });
});

describe("consentDefaultScript", () => {
  it("denies ads storage and sets analytics storage", () => {
    const script = consentDefaultScript("denied");
    expect(script).toContain("gtag('consent','default'");
    expect(script).toContain("ad_storage:'denied'");
    expect(script).toContain("ad_user_data:'denied'");
    expect(script).toContain("ad_personalization:'denied'");
    expect(script).toContain("analytics_storage:'denied'");
    expect(consentDefaultScript("granted")).toContain("analytics_storage:'granted'");
  });
});
