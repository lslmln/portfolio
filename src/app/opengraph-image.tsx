import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Si Min Lee · Product Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const geistSemiBold = readFile(
  join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf"),
);
const geistMedium = readFile(
  join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-Medium.ttf"),
);

export default async function Image() {
  const [semiBold, medium] = await Promise.all([geistSemiBold, geistMedium]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#EEEAE3",
          padding: "96px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Geist",
            fontWeight: 600,
            fontSize: 88,
            color: "#2E2E2E",
          }}
        >
          Si Min Lee
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Geist",
            fontWeight: 500,
            fontSize: 40,
            color: "#666666",
            marginTop: 16,
          }}
        >
          Product Designer
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: semiBold, style: "normal", weight: 600 },
        { name: "Geist", data: medium, style: "normal", weight: 500 },
      ],
    },
  );
}
