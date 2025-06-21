// Form options for all signup schemas

// Music genres
export const musicGenres = [
  'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Country', 'Electronic/EDM', 'Jazz', 'Classical',
  'Folk', 'Blues', 'Reggae', 'Metal', 'Punk', 'Indie', 'Alternative', 'Funk',
  'Soul', 'Gospel', 'Latin', 'World', 'Experimental', 'Ambient', 'House', 'Techno',
  'Trance', 'Drum & Bass', 'Dubstep', 'Trap', 'Lo-Fi', 'Acoustic', 'Singer-Songwriter',
  'Progressive', 'Grunge', 'Ska', 'Hardcore', 'Post-Rock', 'Shoegaze', 'Synthwave',
  'Chillout', 'New Age', 'Soundtrack', 'Spoken Word', 'Comedy', 'Children\'s Music'
].sort();

// Sub-genres for artists
export const subGenres = [
  'Alternative Rock', 'Indie Pop', 'Dream Pop', 'Bedroom Pop', 'Synthpop', 'Electropop',
  'Future Bass', 'Deep House', 'Progressive House', 'Tech House', 'Minimal Techno',
  'Hardstyle', 'Future Funk', 'Vaporwave', 'Lo-Fi Hip-Hop', 'Trap Soul', 'Alternative R&B',
  'Contemporary Jazz', 'Smooth Jazz', 'Neo-Soul', 'Contemporary Classical', 'Minimalism',
  'Post-Classical', 'Americana', 'Indie Folk', 'Psychedelic Rock', 'Garage Rock',
  'Post-Punk', 'New Wave', 'Dark Wave', 'Witch House', 'Chillwave', 'Retrowave'
].sort();

// Musical instruments
export const instruments = [
  'Vocals', 'Guitar', 'Bass Guitar', 'Electric Guitar', 'Acoustic Guitar', 'Piano', 'Keyboard',
  'Synthesizer', 'Drums', 'Percussion', 'Violin', 'Viola', 'Cello', 'Double Bass',
  'Trumpet', 'Trombone', 'French Horn', 'Tuba', 'Saxophone', 'Clarinet', 'Flute',
  'Oboe', 'Bassoon', 'Harmonica', 'Accordion', 'Banjo', 'Mandolin', 'Ukulele',
  'Harp', 'Organ', 'Xylophone', 'Marimba', 'Vibraphone', 'Timpani', 'Djembe',
  'Cajon', 'Bongos', 'Congas', 'Steel Drums', 'Sitar', 'Didgeridoo', 'Bagpipes',
  'Harmonic', 'Melodica', 'Kalimba', 'Theremin', 'Turntables', 'DJ Controller',
  'Sampler', 'Drum Machine', 'MIDI Controller', 'Audio Interface', 'Microphone'
].sort();

// Producer specializations
export const producerSpecializations = [
  'Hip-Hop Production', 'Electronic Music Production', 'Pop Production', 'Rock Production',
  'R&B Production', 'Jazz Production', 'Classical Recording', 'World Music',
  'Sound Design', 'Audio Post-Production', 'Film Scoring', 'Game Audio',
  'Podcast Production', 'Voiceover Recording', 'Live Sound', 'Location Recording',
  'Mixing', 'Mastering', 'Audio Restoration', 'Surround Sound', 'Immersive Audio',
  'Vocal Production', 'Beat Making', 'Songwriting', 'Arrangement', 'Orchestration'
].sort();

// Studio equipment
export const studioEquipment = [
  'Pro Tools', 'Logic Pro', 'Ableton Live', 'FL Studio', 'Cubase', 'Studio One',
  'Reaper', 'Reason', 'GarageBand', 'Neve Console', 'SSL Console', 'API Console',
  'Focusrite Interface', 'Universal Audio Interface', 'RME Interface', 'Antelope Interface',
  'Neumann Microphones', 'AKG Microphones', 'Shure Microphones', 'Audio-Technica Microphones',
  'Yamaha Monitors', 'KRK Monitors', 'Genelec Monitors', 'Adam Audio Monitors',
  'Avalon Preamps', 'API Preamps', 'Neve Preamps', 'Universal Audio Plugins',
  'Waves Plugins', 'FabFilter Plugins', 'iZotope Suite', '1176 Compressor',
  'LA-2A Compressor', 'Lexicon Reverb', 'TC Electronic', 'Eventide Effects',
  'Moog Synthesizers', 'Nord Synthesizers', 'Dave Smith Instruments', 'Korg Synths',
  'Akai MPC', 'Native Instruments Maschine', 'Roland TR Series', 'Acoustic Treatment',
  'Isolation Booths', 'Patch Bays', 'Monitor Controllers', 'Headphone Amplifiers'
].sort();

// Digital Audio Workstations
export const dawOptions = [
  'Pro Tools', 'Logic Pro X', 'Ableton Live', 'FL Studio', 'Cubase', 'Studio One',
  'Reaper', 'Reason', 'GarageBand', 'Bitwig Studio', 'Nuendo', 'Sonar', 'Samplitude',
  'Ardour', 'Mixcraft', 'Cakewalk', 'Luna', 'Harrison Mixbus', 'Waveform', 'Tracktion'
].sort();

// Management areas
export const managementAreas = [
  { value: 'career-development', label: 'Career Development & Strategy' },
  { value: 'booking', label: 'Booking & Live Performance' },
  { value: 'marketing', label: 'Marketing & Promotion' },
  { value: 'financial', label: 'Financial Management' },
  { value: 'legal', label: 'Legal Affairs & Contracts' },
  { value: 'publishing', label: 'Publishing & Royalties' }
];

// Network connections
export const networkConnections = [
  { value: 'labels', label: 'Record Labels' },
  { value: 'venues', label: 'Venues & Promoters' },
  { value: 'festivals', label: 'Music Festivals' },
  { value: 'media', label: 'Music Media & Press' },
  { value: 'streaming', label: 'Streaming Platforms' },
  { value: 'sync', label: 'Sync & Licensing' }
];

// Distribution channels
export const distributionChannels = [
  { value: 'streaming', label: 'Streaming Platforms' },
  { value: 'download', label: 'Digital Downloads' },
  { value: 'physical', label: 'Physical Media (CD/Vinyl)' },
  { value: 'sync', label: 'Sync Licensing' },
  { value: 'radio', label: 'Radio & Broadcasting' }
];

// Territories for publishers
export const territories = [
  'North America', 'Latin America', 'Europe', 'United Kingdom', 'Germany', 'France',
  'Scandinavia', 'Eastern Europe', 'Asia Pacific', 'Japan', 'South Korea', 'China',
  'Southeast Asia', 'Australia & New Zealand', 'Middle East', 'Africa', 'Worldwide'
].sort();

// Performing Rights Societies
export const performingRightsSocieties = [
  'ASCAP (USA)', 'BMI (USA)', 'SESAC (USA)', 'PRS (UK)', 'GEMA (Germany)',
  'SACEM (France)', 'SIAE (Italy)', 'SGAE (Spain)', 'STIM (Sweden)', 'KODA (Denmark)',
  'TEOSTO (Finland)', 'SABAM (Belgium)', 'SUISA (Switzerland)', 'AKM (Austria)',
  'JASRAC (Japan)', 'KOMCA (South Korea)', 'APRA (Australia)', 'SOCAN (Canada)',
  'UBC (Brazil)', 'SACVEN (Venezuela)', 'SPA (Singapore)', 'CASH (Hong Kong)'
].sort();

// Music discovery methods
export const musicDiscoveryMethods = [
  { value: 'streaming', label: 'Streaming Platforms (Spotify, Apple Music, etc.)' },
  { value: 'radio', label: 'Radio (FM/AM/Internet)' },
  { value: 'social-media', label: 'Social Media (TikTok, Instagram, YouTube)' },
  { value: 'friends', label: 'Friends & Word of Mouth' },
  { value: 'concerts', label: 'Live Concerts & Events' },
  { value: 'blogs', label: 'Music Blogs & Websites' }
];

// Streaming platforms
export const streamingPlatforms = [
  'Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music', 'Tidal', 'Deezer',
  'Pandora', 'SoundCloud', 'Bandcamp', 'Beatport', 'Traxsource', 'Audiomack',
  'iHeartRadio', 'TuneIn', 'Mixcloud', 'Last.fm', 'Napster', 'Qobuz', 'Anghami',
  'JioSaavn', 'Gaana', 'Wynk Music', 'NetEase Cloud Music', 'QQ Music', 'KKBox'
].sort();

// Education subjects
export const educationSubjects = [
  'Music Theory', 'Composition', 'Songwriting', 'Music Production', 'Audio Engineering',
  'Music Business', 'Music History', 'Music Appreciation', 'Performance Technique',
  'Sight Reading', 'Ear Training', 'Improvisation', 'Ensemble Performance',
  'Music Technology', 'Recording Techniques', 'Live Sound', 'MIDI Programming',
  'Music Therapy', 'Conducting', 'Arranging', 'Orchestration', 'Jazz Studies',
  'Classical Performance', 'Popular Music', 'World Music', 'Electronic Music',
  'Sound Design', 'Film Scoring', 'Music Pedagogy', 'Music Psychology'
].sort();

// Teaching certifications
export const teachingCertifications = [
  'Bachelor of Music Education', 'Master of Music Education', 'Teaching License',
  'Suzuki Method Certification', 'Kodály Method Certification', 'Orff Certification',
  'Royal Conservatory Certification', 'Trinity College Certification', 'ABRSM Certification',
  'Guild Certification', 'Music Teachers National Association (MTNA)',
  'Piano Technicians Guild', 'Recording Industry Association', 'Audio Engineering Society',
  'Berklee Certification', 'Musicians Institute Certification', 'Private Studio Certification'
].sort();

// Writing focus areas
export const writingFocusAreas = [
  { value: 'reviews', label: 'Album & Concert Reviews' },
  { value: 'interviews', label: 'Artist Interviews' },
  { value: 'news', label: 'Music Industry News' },
  { value: 'features', label: 'Feature Articles' },
  { value: 'criticism', label: 'Music Criticism' },
  { value: 'industry-analysis', label: 'Industry Analysis' }
];

// Press opportunities
export const pressOpportunities = [
  { value: 'press-releases', label: 'Press Release Distribution' },
  { value: 'interview-opportunities', label: 'Artist Interview Opportunities' },
  { value: 'album-reviews', label: 'Album Review Submissions' },
  { value: 'event-coverage', label: 'Live Event Coverage Access' }
];

// Venue types
export const venueTypes = [
  { value: 'club', label: 'Music Club/Nightclub' },
  { value: 'theater', label: 'Theater/Concert Hall' },
  { value: 'arena', label: 'Arena/Stadium' },
  { value: 'festival', label: 'Festival Ground' },
  { value: 'bar', label: 'Bar/Pub' },
  { value: 'restaurant', label: 'Restaurant/Cafe' },
  { value: 'outdoor', label: 'Outdoor Venue' },
  { value: 'private', label: 'Private Event Space' }
];

// Capacity ranges
export const capacityRanges = [
  { value: 'under-100', label: 'Under 100' },
  { value: '100-500', label: '100 - 500' },
  { value: '500-1000', label: '500 - 1,000' },
  { value: '1000-5000', label: '1,000 - 5,000' },
  { value: '5000+', label: '5,000+' }
];

// Event frequency options
export const eventFrequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'special-events', label: 'Special Events Only' }
];

// Student age groups
export const studentAgeGroups = [
  { value: 'children', label: 'Children (5-12)' },
  { value: 'teens', label: 'Teenagers (13-17)' },
  { value: 'adults', label: 'Adults (18-64)' },
  { value: 'seniors', label: 'Seniors (65+)' }
];

// Lesson formats
export const lessonFormats = [
  { value: 'in-person', label: 'In-Person Lessons' },
  { value: 'online', label: 'Online/Virtual Lessons' },
  { value: 'group', label: 'Group Classes' },
  { value: 'individual', label: 'Individual Lessons' }
];

// Experience ranges
export const experienceRanges = [
  { value: '0-2', label: '0-2 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '6-10', label: '6-10 years' },
  { value: '11-15', label: '11-15 years' },
  { value: '15+', label: '15+ years' }
];

// Looking for options (artists)
export const artistLookingFor = [
  { value: 'distribution', label: 'Music Distribution' },
  { value: 'promotion', label: 'Marketing & Promotion' },
  { value: 'collaboration', label: 'Collaboration Opportunities' },
  { value: 'label', label: 'Record Label Partnership' },
  { value: 'manager', label: 'Management Services' }
];

// Default values for form initialization
export const defaultFormValues = {
  artist: {
    firstName: '',
    lastName: '',
    email: '',
    artistName: '',
    stageName: '',
    genre: '',
    subGenre: '',
    instruments: [],
    yearsActive: '',
    instagramHandle: '',
    spotifyProfile: '',
    soundcloudProfile: '',
    youtubeChannel: '',
    bandMembers: 1,
    recordingExperience: 'intermediate' as const,
    hasOriginalMusic: true,
    lookingFor: [],
    country: '',
    password: '',
    confirmPassword: '',
    recaptcha: '',
    terms: false,
    newsletter: false,
  },
  label: {
    firstName: '',
    lastName: '',
    email: '',
    labelName: '',
    labelType: 'independent' as const,
    foundedYear: '',
    businessRegistration: '',
    taxId: '',
    headquarters: '',
    website: '',
    genres: [],
    artistCount: '1-5' as const,
    annualRevenue: 'under-100k' as const,
    distributionNeeds: [],
    marketingBudget: 'under-10k' as const,
    country: '',
    password: '',
    confirmPassword: '',
    recaptcha: '',
    terms: false,
    newsletter: false,
  },
  // Add more default values as needed...
};

export type FormOptions = {
  genres: string[];
  subGenres: string[];
  instruments: string[];
  territories: string[];
  // Add more option types as needed...
};
