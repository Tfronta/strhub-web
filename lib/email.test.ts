import { describe, expect, it } from "vitest";
import { escapeHtml } from "./email";

// The admin notification is HTML, and every value in it was typed by the
// submitter. A tool name that carries markup must arrive as text, not as a
// working link in the one mail whose purpose is to get the admin to click.
describe("escapeHtml", () => {
  it("neutralises markup and attribute breakouts", () => {
    expect(escapeHtml('<a href="https://evil/approve">Aprobar</a>')).toBe(
      "&lt;a href=&quot;https://evil/approve&quot;&gt;Aprobar&lt;/a&gt;"
    );
    expect(escapeHtml("Tom's & \"Jerry\"")).toBe("Tom&#39;s &amp; &quot;Jerry&quot;");
  });

  it("leaves ordinary names alone", () => {
    expect(escapeHtml("STRait Razor v3.0")).toBe("STRait Razor v3.0");
    expect(escapeHtml("")).toBe("");
  });
});
