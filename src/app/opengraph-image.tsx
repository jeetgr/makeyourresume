import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME}: free resume builder with ATS-friendly templates`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#14294a";
const PRIMARY = "#ffb400";

const read = (path: string) => readFile(join(process.cwd(), "public", path));

const dataUrl = (png: Buffer) =>
  `data:image/png;base64,${png.toString("base64")}`;

export default async function Image() {
  const [regular, bold, modern, classic] = await Promise.all([
    read("fonts/inter/400.ttf"),
    read("fonts/inter/700.ttf"),
    read("templates/modern.png").then(dataUrl),
    read("templates/classic.png").then(dataUrl),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: ACCENT,
        color: "white",
        fontFamily: "Inter",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 28,
          padding: "0 0 0 80px",
          width: 640,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="64" height="64" viewBox="0 0 70 70">
            <path
              d="M24.0212 13.6247C29.6649 6.62089 40.3351 6.62089 45.9788 13.6247C47.5462 15.5699 49.6022 17.0636 51.9365 17.9532C60.3415 21.1564 63.6388 31.3044 58.7217 38.8361C57.3561 40.9279 56.5708 43.3449 56.4461 45.8398C55.997 54.8233 47.3646 61.0951 38.6821 58.7461C36.2707 58.0938 33.7293 58.0938 31.3179 58.7461C22.6354 61.0951 14.003 54.8233 13.5539 45.8398C13.4292 43.3449 12.6439 40.9279 11.2783 38.8361C6.36123 31.3044 9.6585 21.1564 18.0635 17.9532C20.3978 17.0636 22.4538 15.5699 24.0212 13.6247Z"
              fill={PRIMARY}
            />
            <path
              d="M35 32.2778C38.0069 32.2778 40.4444 29.8402 40.4444 26.8333C40.4444 23.8264 38.0069 21.3889 35 21.3889C31.9931 21.3889 29.5555 23.8264 29.5555 26.8333C29.5555 29.8402 31.9931 32.2778 35 32.2778Z"
              fill="#FFF8E6"
            />
            <path
              d="M46.2778 41.125C46.2778 44.5078 46.2778 47.25 35.3889 47.25C24.5 47.25 24.5 44.5078 24.5 41.125C24.5 37.7422 29.3751 35 35.3889 35C41.4027 35 46.2778 37.7422 46.2778 41.125Z"
              fill="#FEE6AD"
            />
          </svg>
          <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: 1 }}>
            {SITE_NAME.toUpperCase()}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          Make a resume that&nbsp;
          <span style={{ color: PRIMARY }}>gets read.</span>
        </div>
        <div style={{ fontSize: 28, opacity: 0.75, lineHeight: 1.4 }}>
          Free, ATS-friendly templates. Live PDF preview. No sign-up.
        </div>
      </div>
      <div style={{ display: "flex", position: "relative", flex: 1 }}>
        {[
          { src: classic, left: 40, top: 70, rotate: -6 },
          { src: modern, left: 230, top: 120, rotate: 5 },
        ].map(({ src, left, top, rotate }) => (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img
            key={left}
            src={src}
            width={300}
            height={425}
            style={{
              position: "absolute",
              left,
              top,
              transform: `rotate(${rotate}deg)`,
              borderRadius: 8,
              boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
            }}
          />
        ))}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
