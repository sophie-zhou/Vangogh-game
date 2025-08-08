import { readdir } from "fs/promises";
import { NextResponse } from "next/server";

async function getImages(level: string) {
  const files = await readdir(`public/paintings/${level}`);
  return files.map(name => `/paintings/${level}/${name}`);
}

export async function GET() {
  const realImgs = await getImages("real");
  const aiImgs = (
    await Promise.all(
      ["supereasy","easy","plagiarized","difficult"].map(l => getImages(l))
    )
  ).flat();
  const pick = (arr: string[]) => arr[Math.floor(Math.random()*arr.length)];

  return NextResponse.json({
    images: [
      { url: pick(realImgs), label: "real" },
      { url: pick(aiImgs),   label: "plagiarized" }
    ]
  });
}
