import { BlobServiceClient } from "@azure/storage-blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const account = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
  const container = process.env.AZURE_CONTAINER_NAME!;
  const sasToken = process.env.AZURE_SAS_TOKEN!;

  const blobService = new BlobServiceClient(
    `https://${account}.blob.core.windows.net/?${sasToken}`,
  );

  const containerClient = blobService.getContainerClient(container);

  const blobName = `${Date.now()}-${file.name}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const buffer = Buffer.from(await file.arrayBuffer());

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: file.type },
  });

  return NextResponse.json({ url: blockBlobClient.url });
}
