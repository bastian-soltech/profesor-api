import fs from "fs";
import FormData from "form-data";
import axios from "axios";

export async function removeObject(imagePath, maskPath, productSerial = "4e0ac470") {
  const form = new FormData();
  form.append("original_image_file", fs.createReadStream(imagePath));
  form.append("mask_file", fs.createReadStream(maskPath));

  try {
    const response = await axios.post(
      "https://api.ezremove.ai/api/ez-remove/obj-remove/create-job",
      form,
      {
        headers: {
          ...form.getHeaders(),
          accept: "*/*",
          origin: "https://ezremove.ai",
          referer: "https://ezremove.ai/",
          "user-agent": "Mozilla/5.0",
          "product-serial": productSerial,
        },
        maxBodyLength: Infinity,
      }
    );

    const jobId = response.data?.result?.job_id;
    if (!jobId) throw new Error("No job_id in response");

    const result = await axios.get(
      `https://api.ezremove.ai/api/ez-remove/obj-remove/get-job/${jobId}`,
      {
        headers: {
          "user-agent": "Mozilla/5.0",
          "product-serial": productSerial,
        },
      }
    );

    return result.data;
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    throw error;
  }
}
