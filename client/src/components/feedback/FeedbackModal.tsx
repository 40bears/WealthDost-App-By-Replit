import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Upload, X } from "lucide-react";
import { apiClient, axiosInstance } from "@/lib/api";
import { UI } from "@/ui";
import type { FileResponse } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadedFileId, setUploadedFileId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit feedback
      await apiClient.feedback.$post({
        body: {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          fileId: uploadedFileId || undefined,
        }
      });

      UI.toast.success("Feedback Sent!", "Thank you for your feedback. We'll get back to you soon.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setFilePreview(null);
      setUploadedFileId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      UI.toast.error("Failed to send feedback", error?.response?.data?.message || error?.message || "Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type (image or video)
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      UI.toast.error("Invalid file type", "Please select an image or video file");
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      UI.toast.error("File too large", "File size must be less than 5MB");
      return;
    }

    setIsUploadingFile(true);

    try {
      // Create preview for images
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const { data: response } = await axiosInstance.post<FileResponse>('/files/upload', formData);
      setUploadedFileId(response.id);

      UI.toast.success("File uploaded", "File uploaded successfully");
    } catch (error: any) {
      setFilePreview(null);

      const errorMessage = error?.response?.data?.message || error?.message || "Failed to upload file. Please try again.";
      UI.toast.error("Upload failed", errorMessage);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleRemoveFile = () => {
    setFilePreview(null);
    setUploadedFileId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">Feedback</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Get in Touch Section */}
          <div className="space-y-3">
            {/* Email */}
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <div className="mt-1">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">support@wealthdost.com</p>
                <p className="text-sm text-gray-600">We'll respond within 2 hours</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
              <div className="mt-1">
                <Phone className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">+91-93296-25923</p>
                <p className="text-sm text-gray-600">Mon-Fri, 9 AM - 6 PM IST</p>
              </div>
            </div>
          </div>

          {/* Send us a Message Form */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Send us a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-900">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-1.5"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1.5"
                />
              </div>

              {/* Subject */}
              <div>
                <Label htmlFor="subject" className="text-sm font-medium text-gray-900">
                  Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="What can we help you with?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="mt-1.5"
                />
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message" className="text-sm font-medium text-gray-900">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Please describe your issue or question in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={4}
                  className="mt-1.5 resize-none"
                />
              </div>

              {/* Image/Video Upload */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2 block">
                  Image / Video (Optional)
                </Label>

                {filePreview ? (
                  <div className="relative">
                    <img
                      src={filePreview}
                      alt="File preview"
                      className="w-full h-40 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                      disabled={isUploadingFile}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="block">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isUploadingFile}
                    />
                    <div className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Upload className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {isUploadingFile ? 'Uploading...' : 'Upload image or video'}
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF, MP4 up to 5MB
                        </p>
                      </div>
                    </div>
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </div>

          {/* Support Tips */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              For faster support:
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Include your account email or Phone number</li>
              <li>• Describe the issue step by step</li>
              <li>• Attach any related screenshots</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
