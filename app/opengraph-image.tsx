import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "WreckMatch – Free Legal Help After Your Car Accident";

export const size = { width: 1200, height: 630 };

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0f1e",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            color: "#e53e3e",
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          🚨 WERE YOU IN AN ACCIDENT?
        </div>
        <div
          style={{
            color: "white",
            fontSize: 56,
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: 24,
          }}
        >
          WreckMatch
        </div>
        <div style={{ color: "#9ca3af", fontSize: 28, textAlign: "center" }}>
          Free Legal Help · All 50 States · 60 Second Response
        </div>
      </div>
    ),
    { ...size },
  );
}
