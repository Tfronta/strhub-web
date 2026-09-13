import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const alt = "STRhub, central hub for Short Tandem Repeats";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  let logo: string | null = null;
  try {
    const buf = await readFile(
      path.join(process.cwd(), "public", "strhub-logo-pdf.png")
    );
    logo = `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    logo = null;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "72px 88px",
          background:
            "linear-gradient(135deg, #f4fbfb 0%, #e6f6f7 55%, #d4eff1 100%)",
          color: "#0f172a",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} width={120} height={120} alt="" />
          ) : null}
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>
            STRhub
          </div>
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 46,
            fontWeight: 600,
            lineHeight: 1.15,
            maxWidth: 1000,
          }}
        >
          Central Hub for Short Tandem Repeats
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 30,
            color: "#334155",
            maxWidth: 1000,
            lineHeight: 1.3,
          }}
        >
          Open-access platform for forensic STR analysis: marker catalog,
          allele frequencies, mixture simulator and tools.
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 56,
            right: 88,
            fontSize: 28,
            color: "#0099a3",
            fontWeight: 600,
          }}
        >
          strhub.app
        </div>
      </div>
    ),
    { ...size }
  );
}
