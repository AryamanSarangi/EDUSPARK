import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { mediaDeleteService, mediaUploadService } from "@/services";
import { useContext } from "react";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          console.log("Upload response:", response);

          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
            imagePublicId: response.data.public_id,

          });
          setMediaUploadProgress(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function handleRemoveImage() {
    if (!courseLandingFormData?.imagePublicId) {
      setCourseLandingFormData({ ...courseLandingFormData, image: "", imagePublicId: "" });
      return;
    }
    const resp = await mediaDeleteService(courseLandingFormData.imagePublicId);
    if (resp?.success) {
      setCourseLandingFormData({ ...courseLandingFormData, image: "", imagePublicId: "" });
    }
  }

  function handleReplaceClick() {
    document.getElementById("course-image-input")?.click();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <div className="p-4">
        {mediaUploadProgress ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
      </div>
      <CardContent>
        {courseLandingFormData?.image ? (
          <div className="flex items-center gap-4">
            <img src={courseLandingFormData.image} className="max-h-32 rounded" />
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReplaceClick}>Replace</Button>
              <Button variant="destructive" onClick={handleRemoveImage}>Remove</Button>
            </div>
            <Input
              id="course-image-input"
              className="hidden"
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Label>Upload Course Image</Label>
            <Input
              id="course-image-input"
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
