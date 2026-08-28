import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Boobalicious — a fan-run gacha character measurement archive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0c0e14",
          backgroundImage:
            "repeating-linear-gradient(to right, #2a3044 0, #2a3044 1px, transparent 1px, transparent 40px)",
          backgroundPosition: "bottom",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 96,
            fontWeight: 700,
            color: "#f2efe8",
            letterSpacing: "-0.02em",
          }}
        >
          Boobali
          <span style={{ color: "#e4536b" }}>cious</span>
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#a7adc0",
          }}
        >
          Fan-compiled character archive
        </div>
      </div>
    ),
    { ...size }
  );
}
