import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { axiosInstance } from '@/lib/api'
import type { FileResponse } from '@/types'
import { Upload, X } from 'lucide-react'
import { useCreateTribe } from '@/hooks/graphql'

const createTribeSchema = z.object({
  name: z.string()
    .min(3, "Tribe name must be at least 3 characters long")
    .max(50, "Tribe name must be less than 50 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters long")
    .max(500, "Description must be less than 500 characters"),
  category: z.string().min(1, "Please select a category"),
  isPremium: z.boolean(),
  price: z.number().optional(),
  coverImageId: z.number().optional(),
  features: z.object({
    discussionPosts: z.boolean(),
    stockTips: z.boolean(),
    liveEvents: z.boolean(),
    premiumPolls: z.boolean(),
  }).optional(),
}).refine((data) => {
  if (data.isPremium) {
    return data.price !== undefined && data.price > 0;
  }
  return true;
}, {
  message: "Price is required and must be greater than 0",
  path: ["price"],
});

type CreateTribeFormData = z.infer<typeof createTribeSchema>;

interface CreateTribeModalProps {
  isOpen: boolean
  onClose: () => void
  onTribeCreated?: () => void
}

const TRIBE_CATEGORIES = [
  "Value Investing",
  "Technology",
  "Banking",
  "Healthcare",
  "Energy",
  "Stocks",
  "Crypto",
  "Real Estate",
  "Options Trading",
  "Day Trading",
  "Long-term Investing",
  "Mutual Funds",
  "ETFs",
  "Bonds",
  "Commodities",
];

export default function CreateTribeModal({ isOpen, onClose, onTribeCreated }: CreateTribeModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [uploadedFileId, setUploadedFileId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [createTribe, { loading: isSubmitting }] = useCreateTribe()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateTribeFormData>({
    resolver: zodResolver(createTribeSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      isPremium: false,
      price: undefined,
      coverImageId: undefined,
      features: {
        discussionPosts: true,
        stockTips: true,
        liveEvents: false,
        premiumPolls: false,
      }
    }
  });

  const isPremium = watch("isPremium");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);

      const { data: response } = await axiosInstance.post<FileResponse>('/files/upload', formData);
      setUploadedFileId(response.id);
      setValue('coverImageId', response.id);

      toast({
        title: "Image uploaded",
        description: "Cover image uploaded successfully"
      });
    } catch (error: any) {
      setImagePreview(null);

      const errorMessage = error?.response?.data?.message || error?.message || "Failed to upload image. Please try again.";
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setUploadedFileId(null);
    setValue('coverImageId', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: CreateTribeFormData) => {
    try {
      console.log("Creating tribe:", data);

      // Convert features object to array of enabled feature names
      const enabledFeatures: string[] = [];
      if (data.features?.discussionPosts) enabledFeatures.push('discussionPosts');
      if (data.features?.stockTips) enabledFeatures.push('stockTips');
      if (data.features?.liveEvents) enabledFeatures.push('liveEvents');
      if (data.features?.premiumPolls) enabledFeatures.push('premiumPolls');

      const result = await createTribe({
        variables: {
          input: {
            name: data.name,
            description: data.description,
            category: data.category,
            isPremium: data.isPremium,
            price: data.isPremium ? data.price : undefined,
            coverImageId: data.coverImageId,
            features: enabledFeatures
          }
        }
      });

      console.log('Tribe created successfully:', result);

      // Invalidate tribes query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['tribes'] });

      toast({
        title: "Tribe Created!",
        description: "Your tribe has been created successfully!"
      });

      reset();
      setImagePreview(null);
      setUploadedFileId(null);
      onTribeCreated?.();
      onClose();
    } catch (error: any) {
      console.error('Error creating tribe:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create tribe. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    reset();
    setImagePreview(null);
    setUploadedFileId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-5 flex items-center justify-between border-b border-gray-200 shrink-0">
          <h3 className="text-lg font-bold text-gray-900">Create New Tribe</h3>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-5 py-4 overflow-y-auto flex-1 bg-white">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Tribe Name *
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Tech Growth Investors"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Description *
                </label>
                <textarea
                  {...register("description")}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="eg. Deep dive into fundamental analysis and long-term value investing strategies"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Industry *
                </label>
                <Select onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIBE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Monetization *
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="false"
                      className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      checked={!isPremium}
                      onChange={() => setValue("isPremium", false)}
                    />
                    <span className="text-sm text-gray-900">Free</span>
                  </label>
                  {/* <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="true"
                      className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      checked={isPremium}
                      onChange={() => setValue("isPremium", true)}
                    />
                    <span className="text-sm text-gray-900">Premium</span>
                  </label> */}
                </div>
                {isPremium && (
                  <div className="mt-3">
                    <input
                      type="number"
                      {...register("price", { valueAsNumber: true })}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="eg : 500"
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Tribe Features
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("features.discussionPosts")}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-900">Discussion posts</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("features.stockTips")}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-900">Stock Tips</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("features.liveEvents")}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      disabled
                    />
                    <span className="text-sm text-gray-700">Live events & webinars (coming soon)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("features.premiumPolls")}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      disabled
                    />
                    <span className="text-sm text-gray-700">Premium polls & insights  (coming soon)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Cover image (Optional)
                </label>

                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Cover preview"
                      className="w-full h-40 object-cover rounded-xl border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                      disabled={isUploadingImage}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="block">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                    <div className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Upload className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {isUploadingImage ? 'Uploading...' : 'Upload cover image'}
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="px-5 py-4 border-t border-gray-200 bg-white shrink-0">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 py-2.5 text-base font-medium border-gray-300 hover:bg-gray-50 rounded-lg"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 py-2.5 text-base font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                disabled={isSubmitting || isUploadingImage}
              >
                {isSubmitting ? "Creating..." : "Create Tribe"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
