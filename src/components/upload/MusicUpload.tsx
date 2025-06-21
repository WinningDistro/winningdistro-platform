import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Upload,
  Music,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  FileAudio,
  Calendar,
  Tags
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { musicAPI } from '@/lib/api';
import { useNotifications } from '@/contexts/NotificationContext';

const uploadSchema = z.object({
  title: z.string().min(1, 'Track title is required'),
  artist: z.string().min(1, 'Artist name is required'),
  album: z.string().optional(),
  genre: z.string().min(1, 'Genre is required'),
  releaseType: z.enum(['single', 'ep', 'album']),
  releaseDate: z.string().min(1, 'Release date is required'),
  description: z.string().optional(),
  tags: z.string().optional(),
  explicit: z.boolean().optional().default(false),
  primaryArtist: z.boolean().optional().default(true),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  metadata?: any;
  duration?: number;
  isrc?: string;
}

const MusicUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [currentStep, setCurrentStep] = useState<'upload' | 'metadata' | 'review'>('upload');
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      artist: '',
      album: '',
      genre: '',
      releaseType: 'single',
      releaseDate: '',
      description: '',
      tags: '',
      explicit: false,
      primaryArtist: true,
    },
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, metadata }: { file: File; metadata: UploadFormData }) =>
      musicAPI.uploadTrack(file, metadata),
    onSuccess: (data, variables) => {
      const fileId = uploadedFiles.find(f => f.file === variables.file)?.id;
      if (fileId) {
        setUploadedFiles(prev =>
          prev.map(f =>
            f.id === fileId
              ? { ...f, status: 'complete', metadata: (data as any).data, isrc: (data as any).data?.isrc }
              : f
          )
        );
        toast.success(`${variables.file.name} uploaded successfully!`);

        // Add notification for successful upload
        addNotification({
          type: 'success',
          category: 'upload',
          title: 'Upload Complete!',
          message: `${variables.file.name} has been successfully uploaded and is being processed. ISRC: ${(data as any).data?.isrc}`,
          action: {
            label: 'View Releases',
            onClick: () => window.location.href = '/dashboard?tab=releases'
          }
        });

        queryClient.invalidateQueries({ queryKey: ['releases'] });
      }
    },
    onError: (error, variables) => {
      const fileId = uploadedFiles.find(f => f.file === variables.file)?.id;
      if (fileId) {
        setUploadedFiles(prev =>
          prev.map(f => (f.id === fileId ? { ...f, status: 'error' } : f))
        );
      }
      toast.error(`Failed to upload ${variables.file.name}`);

      // Add notification for upload error
      addNotification({
        type: 'error',
        category: 'upload',
        title: 'Upload Failed',
        message: `Failed to upload ${variables.file.name}. Please try again or contact support.`,
        action: {
          label: 'Retry',
          onClick: () => {
            // Reset file status to allow retry
            if (fileId) {
              setUploadedFiles(prev =>
                prev.map(f => (f.id === fileId ? { ...f, status: 'uploading', progress: 0 } : f))
              );
            }
          }
        }
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const audioFiles = acceptedFiles.filter(file =>
      file.type.startsWith('audio/') ||
      file.name.endsWith('.mp3') ||
      file.name.endsWith('.wav') ||
      file.name.endsWith('.flac')
    );

    if (audioFiles.length !== acceptedFiles.length) {
      toast.error('Only audio files are allowed');
    }

    const newFiles: UploadedFile[] = audioFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      progress: 0,
      status: 'uploading',
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((uploadFile, index) => {
      const progressInterval = setInterval(() => {
        setUploadedFiles(prev =>
          prev.map(f => {
            if (f.id === uploadFile.id && f.progress < 100) {
              const newProgress = Math.min(f.progress + Math.random() * 15, 100);
              if (newProgress === 100) {
                clearInterval(progressInterval);
                return { ...f, progress: newProgress, status: 'processing' };
              }
              return { ...f, progress: newProgress };
            }
            return f;
          })
        );
      }, 200);

      // Auto-populate form with first file's name
      if (index === 0 && !form.getValues('title')) {
        const fileName = uploadFile.file.name.replace(/\.[^/.]+$/, '');
        form.setValue('title', fileName);
      }
    });

    if (audioFiles.length > 0) {
      setCurrentStep('metadata');
    }
  }, [form]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'],
    },
    maxFiles: 10,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const onSubmit = async (data: UploadFormData) => {
    const processingFiles = uploadedFiles.filter(f => f.status === 'processing');

    for (const fileItem of processingFiles) {
      uploadMutation.mutate({
        file: fileItem.file,
        metadata: data,
      });
    }

    setCurrentStep('review');
  };

  const resetUpload = () => {
    setUploadedFiles([]);
    setCurrentStep('upload');
    form.reset();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black border-green">
        <CardHeader>
          <CardTitle className="text-gold flex items-center">
            <Upload className="h-6 w-6 mr-2" />
            Upload Your Music
          </CardTitle>
          <CardDescription className="text-white">
            Upload your tracks and distribute them to 150+ platforms worldwide
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${currentStep === 'upload' ? 'text-gold' : 'text-green'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'upload' ? 'bg-gold text-black' : 'bg-green text-black'
                }`}>
                  1
                </div>
                <span>Upload Files</span>
              </div>
              <div className={`flex items-center space-x-2 ${
                currentStep === 'metadata' ? 'text-gold' :
                currentStep === 'review' ? 'text-green' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'metadata' ? 'bg-gold text-black' :
                  currentStep === 'review' ? 'bg-green text-black' : 'bg-gray-600 text-white'
                }`}>
                  2
                </div>
                <span>Add Metadata</span>
              </div>
              <div className={`flex items-center space-x-2 ${currentStep === 'review' ? 'text-gold' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'review' ? 'bg-gold text-black' : 'bg-gray-600 text-white'
                }`}>
                  3
                </div>
                <span>Review & Submit</span>
              </div>
            </div>
          </div>

          {/* Upload Step */}
          {currentStep === 'upload' && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-gold bg-gold/10' : 'border-green hover:border-gold'
              }`}
            >
              <input {...getInputProps()} />
              <FileAudio className="h-16 w-16 text-green mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gold mb-2">
                Drop your audio files here
              </h3>
              <p className="text-white mb-4">
                or click to browse your computer
              </p>
              <div className="text-sm text-gray-400">
                <p>Supported formats: MP3, WAV, FLAC, AAC, OGG, M4A</p>
                <p>Maximum file size: 100MB per file</p>
                <p>Maximum 10 files at once</p>
              </div>
            </div>
          )}

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-4 mt-6">
              <h4 className="text-gold font-semibold">Uploaded Files</h4>
              {uploadedFiles.map((fileItem) => (
                <div key={fileItem.id} className="bg-zinc-900 p-4 rounded border border-green">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Music className="h-5 w-5 text-green" />
                      <div>
                        <p className="text-white font-medium">{fileItem.file.name}</p>
                        <p className="text-gray-400 text-sm">
                          {(fileItem.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {fileItem.status === 'uploading' && (
                        <Loader2 className="h-4 w-4 text-gold animate-spin" />
                      )}
                      {fileItem.status === 'processing' && (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      {fileItem.status === 'complete' && (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green" />
                          {fileItem.isrc && (
                            <Badge variant="outline" className="text-green border-green">
                              ISRC: {fileItem.isrc}
                            </Badge>
                          )}
                        </>
                      )}
                      {fileItem.status === 'error' && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(fileItem.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {fileItem.status === 'uploading' && (
                    <Progress value={fileItem.progress} className="mt-2" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Metadata Step */}
          {currentStep === 'metadata' && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold">Track Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter track title"
                            className="bg-zinc-900 border-green text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="artist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold">Artist Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter artist name"
                            className="bg-zinc-900 border-green text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="album"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold">Album/EP Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter album name (optional)"
                            className="bg-zinc-900 border-green text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold">Genre *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-900 border-green text-white">
                              <SelectValue placeholder="Select genre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pop">Pop</SelectItem>
                            <SelectItem value="rock">Rock</SelectItem>
                            <SelectItem value="hip-hop">Hip Hop</SelectItem>
                            <SelectItem value="electronic">Electronic</SelectItem>
                            <SelectItem value="r&b">R&B</SelectItem>
                            <SelectItem value="country">Country</SelectItem>
                            <SelectItem value="jazz">Jazz</SelectItem>
                            <SelectItem value="classical">Classical</SelectItem>
                            <SelectItem value="alternative">Alternative</SelectItem>
                            <SelectItem value="indie">Indie</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="releaseType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold">Release Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-900 border-green text-white">
                              <SelectValue placeholder="Select release type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="ep">EP</SelectItem>
                            <SelectItem value="album">Album</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="releaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Release Date *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="bg-zinc-900 border-green text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your music..."
                          className="bg-zinc-900 border-green text-white"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold flex items-center">
                        <Tags className="h-4 w-4 mr-1" />
                        Tags
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter tags separated by commas"
                          className="bg-zinc-900 border-green text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep('upload')}
                    className="btn-secondary"
                  >
                    Back to Upload
                  </Button>
                  <Button
                    type="submit"
                    className="btn-primary"
                    disabled={uploadMutation.isPending}
                  >
                    {uploadMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Submit for Distribution'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {/* Review Step */}
          {currentStep === 'review' && (
            <div className="text-center space-y-6">
              <CheckCircle2 className="h-16 w-16 text-green mx-auto" />
              <div>
                <h3 className="text-2xl font-bold text-gold mb-2">Upload Complete!</h3>
                <p className="text-white">
                  Your music has been submitted for distribution. You'll receive an email confirmation shortly.
                </p>
              </div>
              <div className="bg-zinc-900 p-4 rounded border border-green">
                <h4 className="text-gold font-semibold mb-2">What happens next?</h4>
                <ul className="text-white text-left space-y-1">
                  <li>• Quality review (1-2 hours)</li>
                  <li>• Distribution to platforms (24-48 hours)</li>
                  <li>• Email notification when live</li>
                  <li>• Analytics available in your dashboard</li>
                </ul>
              </div>
              <Button onClick={resetUpload} className="btn-primary">
                Upload More Music
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicUpload;
