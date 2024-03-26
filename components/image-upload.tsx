"use client";

import React, { useEffect, useState } from "react";
import { ImagePlus, Trash } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { Card, CardContent } from "./ui/card";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[]; // Array of image URLs
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  // State to track if the component is mounted
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set isMounted to true when the component is mounted
    setIsMounted(true);
  }, []);

  // Function to handle image upload
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    // Return null if the component is not yet mounted
    return null;
  }

  return (
    <div>
      {/* Display uploaded images as thumbnails */}
      <div className="mb-4 gap-4">
        {value.map((url) => (
          <Card key={url}>
            <CardContent className="p-4">
              <div
                key={url}
                className="relative w-full h-[250px] flex items-center rounded-md overflow-hidden"
              >
                {/* Remove button for each image */}
                <div className="z-10 absolute top-2 right-2">
                  <Button
                    type="button"
                    onClick={() => onRemove(url)}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
                {/* Display the image */}
                <Image
                  fill
                  className="object-contain my-auto"
                  alt="Image"
                  src={url}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {value.length === 0 && (
        <CldUploadWidget onUpload={onUpload} uploadPreset="vdou0v5y">
          {({ open }) => {
            const onClick = () => {
              // Open the file dialog for image uploads
              open();
            };

            return (
              <Button
                type="button"
                disabled={disabled}
                variant="secondary"
                onClick={onClick}
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                Upload photo
              </Button>
            );
          }}
        </CldUploadWidget>
      )}
    </div>
  );
};

export default ImageUpload;
