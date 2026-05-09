export async function uploadImageToCloudinary(file: File, folder: string): Promise<string> {
  // Hardcoded fallback so image uploads work even without .env variables
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dr09ffigi";
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "restaurant_preset";
  const cloudFolder = import.meta.env.VITE_CLOUDINARY_FOLDER || "samples/ecommerce";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", cloudFolder || folder);

  let response: Response;
  try {
    response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error(
      "Cloudinary upload failed to connect. Check internet/VPN/adblock, and verify the upload preset is unsigned."
    );
  }

  if (!response.ok) {
    let message = "Cloudinary upload failed.";
    try {
      const data = (await response.json()) as { error?: { message?: string } };
      if (data.error?.message) message = `Cloudinary upload failed: ${data.error.message}`;
    } catch {
      // Keep the generic message if Cloudinary does not return JSON.
    }
    throw new Error(message);
  }

  const data = (await response.json()) as { secure_url?: string };
  if (!data.secure_url) {
    throw new Error("Cloudinary did not return an image URL.");
  }

  return data.secure_url;
}
