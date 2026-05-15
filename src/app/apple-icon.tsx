import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #1a475d 0%, #286a8b 55%, #3f6e44 100%)",
          color: "#fdf5ef",
          fontSize: 124,
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontWeight: 700,
          fontStyle: "italic",
          letterSpacing: "-0.04em",
          textShadow: "0 6px 16px rgba(0,0,0,0.25)",
        }}
      >
        C
      </div>
    ),
    { ...size },
  );
}
