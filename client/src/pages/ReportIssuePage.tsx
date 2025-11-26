import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Camera, Upload, X, Check, MapPin, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import LocationPicker from '../components/map/LocationPicker';
import { useAuthStore } from '../store/authStore';
import { useIssueStore } from '../store/issueStore';
import { IssueCategory, GeoLocation } from '../types';
import { categoryInfo } from '../data/mockData';

interface ReportFormData {
  title: string;
  description: string;
  category: IssueCategory;
  isAnonymous: boolean;
}

const ReportIssuePage: React.FC = () => {
  const { user } = useAuthStore();
  const { createIssue } = useIssueStore();
  const navigate = useNavigate();
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ReportFormData>({
    defaultValues: {
      title: '',
      description: '',
      category: 'roads',
      isAnonymous: false,
    },
  });
  
  const handleLocationSelect = (selectedLocation: GeoLocation) => {
    setLocation(selectedLocation);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real app, we would upload the image to a server here
      // For demo, we'll create a URL for the local file
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImages]);
    }
  };
  
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  
  const onSubmit = async (data: ReportFormData) => {
    if (!location) {
      setSubmitError('Please select a location for the issue');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // For demo, we'll use sample images if none are uploaded
      const finalImages = images.length > 0 
        ? images 
        : [
            'https://images.pexels.com/photos/2768961/pexels-photo-2768961.jpeg?auto=compress&cs=tinysrgb&w=600',
          ];
      
      const issueData = {
        title: data.title,
        description: data.description,
        category: data.category,
        location,
        images: finalImages,
        reporterId: user?.id || '',
        isAnonymous: data.isAnonymous,
      };
      
      const issueId = await createIssue(issueData);
      
      if (issueId) {
        // Success! Redirect to the issue page
        navigate(`/issues/${issueId}`);
      } else {
        throw new Error('Failed to create issue');
      }
    } catch (error) {
      console.error('Error creating issue:', error);
      setSubmitError('Failed to submit the issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="py-8">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Report a Civic Issue</h1>
          <p className="text-gray-600 mb-8">
            Help improve your community by reporting issues that need attention.
          </p>
        </motion.div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="bg-primary-100 text-primary-600 w-7 h-7 rounded-full flex items-center justify-center mr-2 text-sm">1</span>
                  Issue Details
                </h2>
                
                <div className="space-y-4">
                  <Input
                    label="Issue Title"
                    placeholder="Describe the issue briefly"
                    error={errors.title?.message}
                    fullWidth
                    {...register('title', {
                      required: 'Title is required',
                      minLength: {
                        value: 5,
                        message: 'Title must be at least 5 characters long',
                      },
                    })}
                  />
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Issue Description
                    </label>
                    <textarea
                      className={`block w-full rounded-lg border ${errors.description ? 'border-error-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 ${errors.description ? 'focus:ring-error-500' : 'focus:ring-primary-500'} focus:ring-offset-2 min-h-[120px]`}
                      placeholder="Describe the issue in detail, including when you noticed it and any relevant information"
                      {...register('description', {
                        required: 'Description is required',
                        minLength: {
                          value: 20,
                          message: 'Description must be at least 20 characters long',
                        },
                      })}
                    />
                    {errors.description && (
                      <p className="text-error-500 text-sm">{errors.description.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Issue Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      <Controller
                        control={control}
                        name="category"
                        render={({ field }) => (
                          <>
                            {Object.entries(categoryInfo).map(([key, category]) => (
                              <div
                                key={key}
                                className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                                  field.value === key
                                    ? 'bg-primary-50 border-primary-500'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => field.onChange(key)}
                              >
                                <div className="flex flex-col items-center">
                                  <div className={`${category.color} text-white p-2 rounded-full mb-2`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-${category.icon}`}>
                                      {category.icon === 'road' && (
                                        <>
                                          <path d="M5 12 L19 12"></path>
                                          <path d="M5 4 L19 4"></path>
                                          <path d="M5 20 L19 20"></path>
                                        </>
                                      )}
                                      {category.icon === 'droplets' && (
                                        <>
                                          <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path>
                                          <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path>
                                        </>
                                      )}
                                      {category.icon === 'zap' && (
                                        <>
                                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                        </>
                                      )}
                                      {category.icon === 'trash-2' && (
                                        <>
                                          <path d="M3 6h18"></path>
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                          <line x1="10" x2="10" y1="11" y2="17"></line>
                                          <line x1="14" x2="14" y1="11" y2="17"></line>
                                        </>
                                      )}
                                      {category.icon === 'pipe' && (
                                        <>
                                          <path d="M12 2v10"></path>
                                          <path d="M12 12v10"></path>
                                          <path d="M16 12h.01"></path>
                                          <path d="M8 12h.01"></path>
                                          <path d="M16 12a4 4 0 0 1 4 4"></path>
                                          <path d="M8 12a4 4 0 0 0-4 4"></path>
                                        </>
                                      )}
                                      {category.icon === 'factory' && (
                                        <>
                                          <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                                          <path d="M17 18h1"></path>
                                          <path d="M12 18h1"></path>
                                          <path d="M7 18h1"></path>
                                        </>
                                      )}
                                      {category.icon === 'shield' && (
                                        <>
                                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                        </>
                                      )}
                                      {category.icon === 'car' && (
                                        <>
                                          <path d="M14 16H9m10 0h3v-3.6a.6.6 0 0 0-.4-.56l-.33-.1a6 6 0 0 1-4.27-4.27l-.1-.33a.6.6 0 0 0-.56-.4H7.66a.6.6 0 0 0-.56.4l-.1.33a6 6 0 0 1-4.27 4.27l-.33.1a.6.6 0 0 0-.4.56V16h3"></path>
                                          <circle cx="6.5" cy="16.5" r="2.5"></circle>
                                          <circle cx="16.5" cy="16.5" r="2.5"></circle>
                                        </>
                                      )}
                                      {category.icon === 'more-horizontal' && (
                                        <>
                                          <circle cx="12" cy="12" r="1"></circle>
                                          <circle cx="19" cy="12" r="1"></circle>
                                          <circle cx="5" cy="12" r="1"></circle>
                                        </>
                                      )}
                                    </svg>
                                  </div>
                                  <span className="text-xs font-medium text-center">{category.name}</span>
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="bg-primary-100 text-primary-600 w-7 h-7 rounded-full flex items-center justify-center mr-2 text-sm">2</span>
                  Location
                </h2>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    Select the exact location of the issue on the map.
                  </p>
                  
                  <LocationPicker 
                    onLocationSelect={handleLocationSelect}
                  />
                  
                  {!location && submitError && (
                    <p className="text-error-500 text-sm">{submitError}</p>
                  )}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="bg-primary-100 text-primary-600 w-7 h-7 rounded-full flex items-center justify-center mr-2 text-sm">3</span>
                  Photos
                </h2>
                
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Add photos to help authorities better understand the issue.
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((src, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={src} 
                          alt={`Uploaded ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 text-white rounded-full p-1"
                          onClick={() => removeImage(index)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    
                    <label className="cursor-pointer aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                      <Camera size={24} className="mb-2 text-gray-400" />
                      <span className="text-sm text-gray-500">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    You can upload up to 5 photos. Each photo must be less than 5MB.
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="bg-primary-100 text-primary-600 w-7 h-7 rounded-full flex items-center justify-center mr-2 text-sm">4</span>
                  Privacy
                </h2>
                
                <div className="flex items-center">
                  <Controller
                    control={control}
                    name="isAnonymous"
                    render={({ field }) => (
                      <div 
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                          field.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                        }`}
                        onClick={() => field.onChange(!field.value)}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                          field.value ? 'bg-primary-500' : 'border border-gray-300'
                        }`}>
                          {field.value && <Check size={12} className="text-white" />}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">Report Anonymously</span>
                            {field.value ? (
                              <EyeOff size={16} className="ml-2 text-primary-500" />
                            ) : (
                              <Eye size={16} className="ml-2 text-gray-400" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            Your name and profile will not be visible to the public.
                          </p>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
              
              {submitError && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-start">
                  <AlertTriangle size={20} className="text-error-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-error-700 font-medium">Error</p>
                    <p className="text-error-600 text-sm">{submitError}</p>
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={isSubmitting}
                >
                  Clear Form
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  isLoading={isSubmitting}
                  leftIcon={<Upload size={16} />}
                >
                  Submit Issue
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssuePage;