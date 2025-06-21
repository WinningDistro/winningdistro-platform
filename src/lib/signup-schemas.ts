import { z } from 'zod';

// Base schema with common fields
const baseSignupSchema = {
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  country: z.string().min(1, 'Please select your country'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
  recaptcha: z.string().min(1, 'Please complete the reCAPTCHA verification'),
  terms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
  newsletter: z.boolean().optional(),
};

// Artist/Musician Signup Schema
export const artistSignupSchema = z.object({
  ...baseSignupSchema,
  artistName: z.string().min(2, 'Artist name must be at least 2 characters'),
  stageName: z.string().optional(),
  genre: z.string().min(1, 'Please select your primary genre'),
  subGenre: z.string().optional(),
  instruments: z.array(z.string()).optional(),
  yearsActive: z.string().optional(),
  instagramHandle: z.string().optional(),
  spotifyProfile: z.string().optional(),
  soundcloudProfile: z.string().optional(),
  youtubeChannel: z.string().optional(),
  bandMembers: z.number().optional(),
  recordingExperience: z.enum(['beginner', 'intermediate', 'professional', 'expert']).optional(),
  hasOriginalMusic: z.boolean().optional(),
  lookingFor: z.array(z.enum(['distribution', 'promotion', 'collaboration', 'label', 'manager'])).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Record Label Signup Schema
export const labelSignupSchema = z.object({
  ...baseSignupSchema,
  labelName: z.string().min(2, 'Label name must be at least 2 characters'),
  labelType: z.enum(['independent', 'major', 'subsidiary', 'boutique']),
  foundedYear: z.string().optional(),
  businessRegistration: z.string().optional(),
  taxId: z.string().optional(),
  headquarters: z.string().optional(),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  genres: z.array(z.string()).min(1, 'Please select at least one genre'),
  artistCount: z.enum(['1-5', '6-20', '21-50', '51-100', '100+']).optional(),
  annualRevenue: z.enum(['under-100k', '100k-500k', '500k-1m', '1m-5m', '5m+']).optional(),
  distributionNeeds: z.array(z.enum(['digital', 'physical', 'sync', 'radio', 'streaming'])).optional(),
  marketingBudget: z.enum(['under-10k', '10k-50k', '50k-100k', '100k+']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Producer/Studio Signup Schema
export const producerSignupSchema = z.object({
  ...baseSignupSchema,
  producerName: z.string().min(2, 'Producer name must be at least 2 characters'),
  studioName: z.string().optional(),
  producerType: z.enum(['music-producer', 'sound-engineer', 'mixing-engineer', 'mastering-engineer', 'studio-owner']),
  specializations: z.array(z.string()).min(1, 'Please select at least one specialization'),
  equipment: z.array(z.string()).optional(),
  daw: z.array(z.string()).optional(), // Digital Audio Workstation
  studioLocation: z.string().optional(),
  hourlyRate: z.enum(['under-50', '50-100', '100-200', '200-500', '500+']).optional(),
  experienceYears: z.enum(['0-2', '3-5', '6-10', '11-15', '15+']).optional(),
  notableClients: z.string().optional(),
  portfolioUrl: z.string().url('Please enter a valid portfolio URL').optional().or(z.literal('')),
  availableForHire: z.boolean().optional(),
  remoteWork: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Music Manager/Agent Signup Schema
export const managerSignupSchema = z.object({
  ...baseSignupSchema,
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  managerType: z.enum(['artist-manager', 'booking-agent', 'talent-agent', 'business-manager']),
  licenseNumber: z.string().optional(),
  clientCount: z.enum(['1-5', '6-15', '16-30', '31-50', '50+']).optional(),
  managementAreas: z.array(z.enum(['career-development', 'booking', 'marketing', 'financial', 'legal', 'publishing'])),
  businessStructure: z.enum(['sole-proprietorship', 'llc', 'corporation', 'partnership']).optional(),
  commissionRate: z.enum(['10-15%', '16-20%', '21-25%', '26-30%']).optional(),
  territoryFocus: z.array(z.string()).optional(),
  networkConnections: z.array(z.enum(['labels', 'venues', 'festivals', 'media', 'streaming', 'sync'])).optional(),
  yearsInBusiness: z.enum(['0-2', '3-5', '6-10', '11-15', '15+']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Music Publisher/Distributor Signup Schema
export const publisherSignupSchema = z.object({
  ...baseSignupSchema,
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  businessType: z.enum(['music-publisher', 'distributor', 'sync-agency', 'collection-society']),
  businessRegistration: z.string().optional(),
  performingRightsSociety: z.string().optional(), // ASCAP, BMI, SESAC, etc.
  territorialRights: z.array(z.string()).min(1, 'Please select at least one territory'),
  catalogSize: z.enum(['under-100', '100-500', '500-1000', '1000-5000', '5000+']).optional(),
  distributionChannels: z.array(z.enum(['streaming', 'download', 'physical', 'sync', 'radio'])),
  royaltyRate: z.enum(['70-75%', '76-80%', '81-85%', '86-90%', '90%+']).optional(),
  advancePayments: z.boolean().optional(),
  marketingServices: z.boolean().optional(),
  analyticsReporting: z.boolean().optional(),
  globalReach: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Fan/Listener Signup Schema (for music discovery platform)
export const fanSignupSchema = z.object({
  ...baseSignupSchema,
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  favoriteGenres: z.array(z.string()).min(1, 'Please select at least one favorite genre'),
  musicDiscoveryMethods: z.array(z.enum(['streaming', 'radio', 'social-media', 'friends', 'concerts', 'blogs'])).optional(),
  concertFrequency: z.enum(['never', 'rarely', 'monthly', 'weekly', 'multiple-per-week']).optional(),
  musicSpending: z.enum(['0', '1-25', '26-50', '51-100', '100+']).optional(), // monthly spending
  streamingPlatforms: z.array(z.string()).optional(),
  supportIndependentArtists: z.boolean().optional(),
  interestedInEarlyAccess: z.boolean().optional(),
  playlistCreator: z.boolean().optional(),
  musicBlogger: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Venue/Event Organizer Signup Schema
export const venueSignupSchema = z.object({
  ...baseSignupSchema,
  venueName: z.string().min(2, 'Venue name must be at least 2 characters'),
  venueType: z.enum(['club', 'theater', 'arena', 'festival', 'bar', 'restaurant', 'outdoor', 'private']),
  capacity: z.enum(['under-100', '100-500', '500-1000', '1000-5000', '5000+']),
  venueAddress: z.string().min(5, 'Please enter venue address'),
  musicGenres: z.array(z.string()).min(1, 'Please select genres you host'),
  eventFrequency: z.enum(['daily', 'weekly', 'monthly', 'seasonal', 'special-events']),
  soundSystem: z.boolean().optional(),
  lightingSystem: z.boolean().optional(),
  recordingCapabilities: z.boolean().optional(),
  cateringAvailable: z.boolean().optional(),
  parkingAvailable: z.boolean().optional(),
  accessibilityCompliant: z.boolean().optional(),
  liquorLicense: z.boolean().optional(),
  averageTicketPrice: z.enum(['free', 'under-20', '20-50', '50-100', '100+']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Music Educator/Teacher Signup Schema
export const educatorSignupSchema = z.object({
  ...baseSignupSchema,
  instructorName: z.string().min(2, 'Instructor name must be at least 2 characters'),
  institution: z.string().optional(),
  educationType: z.enum(['private-instructor', 'school-teacher', 'university-professor', 'online-educator', 'workshop-leader']),
  subjects: z.array(z.string()).min(1, 'Please select at least one subject'),
  instruments: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  teachingExperience: z.enum(['0-2', '3-5', '6-10', '11-15', '15+']),
  studentAgeGroups: z.array(z.enum(['children', 'teens', 'adults', 'seniors'])),
  lessonFormats: z.array(z.enum(['in-person', 'online', 'group', 'individual'])),
  rateRange: z.enum(['under-30', '30-60', '60-100', '100-150', '150+']).optional(),
  performingBackground: z.boolean().optional(),
  musicDegree: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Music Journalist/Blogger Signup Schema
export const journalistSignupSchema = z.object({
  ...baseSignupSchema,
  writerName: z.string().min(2, 'Writer name must be at least 2 characters'),
  publication: z.string().optional(),
  mediaType: z.enum(['magazine', 'newspaper', 'blog', 'podcast', 'youtube', 'freelance']),
  writingFocus: z.array(z.enum(['reviews', 'interviews', 'news', 'features', 'criticism', 'industry-analysis'])),
  genreSpecialty: z.array(z.string()).optional(),
  audienceSize: z.enum(['under-1k', '1k-10k', '10k-50k', '50k-100k', '100k+']).optional(),
  writingExperience: z.enum(['0-1', '2-3', '4-5', '6-10', '10+']),
  pressCredentials: z.boolean().optional(),
  portfolioUrl: z.string().url('Please enter a valid portfolio URL').optional().or(z.literal('')),
  socialMediaReach: z.enum(['under-1k', '1k-10k', '10k-50k', '50k+']).optional(),
  lookingFor: z.array(z.enum(['press-releases', 'interview-opportunities', 'album-reviews', 'event-coverage'])).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Type definitions for each schema
export type ArtistSignupData = z.infer<typeof artistSignupSchema>;
export type LabelSignupData = z.infer<typeof labelSignupSchema>;
export type ProducerSignupData = z.infer<typeof producerSignupSchema>;
export type ManagerSignupData = z.infer<typeof managerSignupSchema>;
export type PublisherSignupData = z.infer<typeof publisherSignupSchema>;
export type FanSignupData = z.infer<typeof fanSignupSchema>;
export type VenueSignupData = z.infer<typeof venueSignupSchema>;
export type EducatorSignupData = z.infer<typeof educatorSignupSchema>;
export type JournalistSignupData = z.infer<typeof journalistSignupSchema>;

// Schema mapping for easy access
export const signupSchemas = {
  artist: artistSignupSchema,
  label: labelSignupSchema,
  producer: producerSignupSchema,
  manager: managerSignupSchema,
  publisher: publisherSignupSchema,
  fan: fanSignupSchema,
  venue: venueSignupSchema,
  educator: educatorSignupSchema,
  journalist: journalistSignupSchema,
} as const;

// User type options for selection
export const userTypes = [
  { value: 'artist', label: 'Artist/Musician', description: 'Recording artists, singers, bands, solo performers' },
  { value: 'label', label: 'Record Label', description: 'Independent and major record labels' },
  { value: 'producer', label: 'Producer/Studio', description: 'Music producers, sound engineers, studio owners' },
  { value: 'manager', label: 'Manager/Agent', description: 'Artist managers, booking agents, talent representatives' },
  { value: 'publisher', label: 'Publisher/Distributor', description: 'Music publishers, distributors, sync agencies' },
  { value: 'venue', label: 'Venue/Organizer', description: 'Concert venues, festival organizers, event planners' },
  { value: 'educator', label: 'Music Educator', description: 'Music teachers, instructors, educational institutions' },
  { value: 'journalist', label: 'Music Journalist', description: 'Music writers, bloggers, critics, podcasters' },
  { value: 'fan', label: 'Music Fan', description: 'Music lovers, playlist creators, supporters' },
] as const;

export type UserType = typeof userTypes[number]['value'];
