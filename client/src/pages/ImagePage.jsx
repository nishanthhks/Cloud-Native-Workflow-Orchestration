import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

function ImagePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/uploads/aws`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Image uploaded successfully!");
      setSelectedFile(null);
      // Reset the file input
      document.getElementById("image").value = "";
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchImage = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/images/latest`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
      alert("Failed to fetch image");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setImageUrl("");
    // Reset the file input
    document.getElementById("image").value = "";
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Image Upload</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-md">
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleFileChange}
            className="w-full"
            accept="image/*"
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={!selectedFile || loading}
            className="bg-blue-500 hover:bg-blue-600">
            {loading ? "Uploading..." : "Upload"}
          </Button>
          <Button type="button" onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleFetchImage}
            className="bg-green-500 hover:bg-green-600">
            Fetch Latest Image
          </Button>
        </div>
      </form>

      {loading && <p className="mt-4">Loading...</p>}

      {imageUrl && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Fetched Image</h2>
          {(
            <img
              src={imageUrl}
              alt="Fetched from server"
              className="max-w-full h-auto border rounded-md shadow-md"
            />
          ) ?? <>hi</>}
        </div>
      )}
    </div>
  );
}

export default ImagePage;
