const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "courses",
      resource_type: "auto", // accepts image or video
    });

    // ✅ Optional: delete local file after upload
    fs.unlinkSync(filePath);

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.secure_url,
    };
  } catch (error) {
    console.error("Cloudinary Upload Failed ❌:", error); // 👈 Important line
    throw new Error("Error uploading to cloudinary");
  }
};

module.exports = {
  uploadMediaToCloudinary,
};
