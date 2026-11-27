import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME}: free resume builder with ATS-friendly templates`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#fbfaf6";
const INK = "#16161a";
const HIGHLIGHT = "#ffc83d";

const read = (path: string) => readFile(join(process.cwd(), "public", path));

const dataUrl = (png: Buffer) =>
  `data:image/png;base64,${png.toString("base64")}`;

export default async function Image() {
  const [regular, bold, serif, serifItalic, modern, classic] =
    await Promise.all([
      read("fonts/inter/400.ttf"),
      read("fonts/inter/700.ttf"),
      read("fonts/instrument-serif/400.ttf"),
      read("fonts/instrument-serif/400i.ttf"),
      read("templates/modern.png").then(dataUrl),
      read("templates/classic.png").then(dataUrl),
    ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: PAPER,
        color: INK,
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
          <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
            <path
              d="M8 3h11l6 6v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
              stroke={INK}
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path
              d="M19 3v6h6"
              stroke={INK}
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <rect
              x="9.5"
              y="13"
              width="12"
              height="3.6"
              rx="1.2"
              fill={HIGHLIGHT}
            />
            <path
              d="M10.5 20.5h10M10.5 24.5h6.5"
              stroke={INK}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
          <span style={{ display: "flex", fontSize: 32, letterSpacing: -0.5 }}>
            make<span style={{ fontWeight: 700 }}>your</span>resume
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontFamily: "Instrument Serif",
            fontSize: 84,
            lineHeight: 1,
            letterSpacing: -1,
          }}
        >
          Make a resume that&nbsp;
          <span
            style={{
              fontStyle: "italic",
              backgroundImage: `linear-gradient(transparent 58%, ${HIGHLIGHT} 58%, ${HIGHLIGHT} 92%, transparent 92%)`,
            }}
          >
            gets read
          </span>
          .
        </div>
        <div style={{ fontSize: 28, color: "#5f5d56", lineHeight: 1.4 }}>
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
              border: "1px solid #e3dfd4",
              boxShadow: "0 20px 50px rgba(22,22,26,0.18)",
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
        { name: "Instrument Serif", data: serif, weight: 400, style: "normal" },
        {
          name: "Instrument Serif",
          data: serifItalic,
          weight: 400,
          style: "italic",
        },
      ],
    },
  );
}
