// Instagram API integration for profile validation and info fetching
interface InstagramUser {
  id: string;
  username: string;
  account_type: 'BUSINESS' | 'CREATOR' | 'PERSONAL';
  media_count?: number;
  followers_count?: number;
  follows_count?: number;
}

interface InstagramProfile {
  exists: boolean;
  verified: boolean;
  username: string;
  displayName?: string;
  bio?: string;
  followerCount?: number;
  postCount?: number;
  isPublic?: boolean;
  profilePicture?: string;
  isBusinessAccount?: boolean;
  category?: string;
}

interface InstagramValidationResult {
  valid: boolean;
  available: boolean;
  profile?: InstagramProfile;
  suggestions: string[];
  error?: string;
  verificationOptions?: InstagramVerificationOption[];
}

interface InstagramVerificationOption {
  username: string;
  displayName: string;
  followers: number;
  verified: boolean;
  profilePicture?: string;
  isBusinessAccount: boolean;
  category?: string;
}

// Validate Instagram username format
export function validateInstagramUsername(username: string): boolean {
  if (!username) return false;

  // Instagram username rules:
  // - 1-30 characters
  // - Only letters, numbers, periods, and underscores
  // - Cannot start or end with period
  // - Cannot have consecutive periods
  const instagramUsernameRegex = /^(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9._]{1,30}$/;

  return instagramUsernameRegex.test(username) &&
         !username.startsWith('.') &&
         !username.endsWith('.');
}

// Mock Instagram profile data for demo purposes
const mockInstagramProfiles: Record<string, InstagramProfile> = {
  'spotify': {
    exists: true,
    verified: true,
    username: 'spotify',
    displayName: 'Spotify',
    bio: 'Music for everyone 🎵',
    followerCount: 4200000,
    postCount: 8500,
    isPublic: true,
    isBusinessAccount: true,
    category: 'App Page'
  },
  'taylorswift': {
    exists: true,
    verified: true,
    username: 'taylorswift',
    displayName: 'Taylor Swift',
    bio: 'Artist • Songwriter',
    followerCount: 250000000,
    postCount: 650,
    isPublic: true,
    isBusinessAccount: false
  },
  'drake': {
    exists: true,
    verified: true,
    username: 'drake',
    displayName: 'Drake',
    bio: 'OVO',
    followerCount: 142000000,
    postCount: 5200,
    isPublic: true,
    isBusinessAccount: false
  }
};

// Get Instagram profile info (mock implementation for demo)
export async function getInstagramProfile(username: string): Promise<InstagramProfile | null> {
  if (!username || !validateInstagramUsername(username)) {
    return null;
  }

  try {
    // Mock implementation - in production, use Instagram Basic Display API
    const appId = import.meta.env.VITE_INSTAGRAM_APP_ID;

    if (!appId || appId === 'your_instagram_app_id_here') {
      console.warn('Instagram API credentials not configured, using mock data');

      // Return mock data for demo
      const lowerUsername = username.toLowerCase();

      if (mockInstagramProfiles[lowerUsername]) {
        return mockInstagramProfiles[lowerUsername];
      }

      // Return basic mock profile for unknown usernames
      return {
        exists: true,
        verified: false,
        username: username,
        displayName: username,
        bio: '',
        followerCount: Math.floor(Math.random() * 10000),
        postCount: Math.floor(Math.random() * 500),
        isPublic: true,
        isBusinessAccount: false
      };
    }

    // In production, implement actual Instagram API calls here
    // Note: Instagram API requires app review for production use
    // This would typically use Instagram Basic Display API or Instagram Graph API

    const response = await fetch(`https://graph.instagram.com/v1/users/self`, {
      headers: {
        'Authorization': `Bearer YOUR_ACCESS_TOKEN`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Instagram profile');
    }

    const data = await response.json();

    return {
      exists: true,
      verified: false, // Would need additional API call to check verification
      username: data.username,
      displayName: data.full_name,
      bio: data.bio,
      followerCount: data.counts?.followed_by,
      postCount: data.counts?.media,
      isPublic: !data.is_private,
      isBusinessAccount: data.account_type === 'business'
    };

  } catch (error) {
    console.error('Instagram API error:', error);
    return null;
  }
}

// Check if Instagram username is available and valid
export async function validateInstagramHandle(username: string): Promise<InstagramValidationResult> {
  if (!username || username.trim().length === 0) {
    return {
      valid: true,
      available: true,
      suggestions: []
    };
  }

  const trimmedUsername = username.trim().replace('@', '');

  // Validate format
  if (!validateInstagramUsername(trimmedUsername)) {
    return {
      valid: false,
      available: false,
      suggestions: [
        trimmedUsername.replace(/[^a-zA-Z0-9._]/g, ''),
        `${trimmedUsername.replace(/[^a-zA-Z0-9]/g, '')}_official`,
        `${trimmedUsername.replace(/[^a-zA-Z0-9]/g, '')}.music`
      ].filter(s => s.length > 0 && s.length <= 30),
      error: 'Username contains invalid characters. Use only letters, numbers, periods, and underscores.'
    };
  }

  try {
    const profile = await getInstagramProfile(trimmedUsername);

    if (profile && profile.exists) {
      // Username is taken
      const suggestions = [
        `${trimmedUsername}_official`,
        `${trimmedUsername}.music`,
        `${trimmedUsername}_artist`,
        `the.${trimmedUsername}`,
        `${trimmedUsername}.band`
      ].filter(s => s.length <= 30);

      return {
        valid: true,
        available: false,
        profile,
        suggestions: suggestions.slice(0, 3),
        error: 'This Instagram username is already taken.'
      };
    }

    // Username appears to be available
    return {
      valid: true,
      available: true,
      suggestions: []
    };

  } catch (error) {
    console.error('Error validating Instagram handle:', error);

    // Return optimistic result on error
    return {
      valid: true,
      available: true,
      suggestions: [],
      error: 'Unable to verify Instagram username at this time.'
    };
  }
}

// Generate Instagram username suggestions based on artist name
export function generateInstagramSuggestions(artistName: string): string[] {
  if (!artistName) return [];

  const baseName = artistName.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 25); // Leave room for suffixes

  const suggestions = [
    baseName,
    `${baseName}_official`,
    `${baseName}.music`,
    `${baseName}_artist`,
    `the.${baseName}`,
    `${baseName}.band`,
    `${baseName}_music`,
    `official.${baseName}`
  ];

  // Filter valid suggestions
  return suggestions
    .filter(s => s.length >= 1 && s.length <= 30)
    .filter(s => validateInstagramUsername(s))
    .slice(0, 5);
}

// Debounced Instagram validation for real-time checking
export function createDebouncedInstagramCheck() {
  let timeoutId: NodeJS.Timeout;

  return function debouncedCheck(
    username: string,
    callback: (result: InstagramValidationResult) => void,
    delay = 600
  ) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(async () => {
      const result = await validateInstagramHandle(username);
      callback(result);
    }, delay);
  };
}

// Format Instagram handle display (add @ if not present)
export function formatInstagramHandle(username: string): string {
  if (!username) return '';
  const clean = username.trim().replace('@', '');
  return clean ? `@${clean}` : '';
}

// Search for Instagram profiles for verification (mock implementation)
export async function searchInstagramForVerification(query: string): Promise<InstagramVerificationOption[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const searchTerm = query.toLowerCase().replace('@', '');

  // Mock search results for demo
  const mockSearchResults: InstagramVerificationOption[] = [];

  // Check if search matches any mock profiles
  Object.values(mockInstagramProfiles).forEach(profile => {
    if (profile.username.toLowerCase().includes(searchTerm) ||
        profile.displayName?.toLowerCase().includes(searchTerm)) {
      mockSearchResults.push({
        username: profile.username,
        displayName: profile.displayName || profile.username,
        followers: profile.followerCount || 0,
        verified: profile.verified,
        profilePicture: profile.profilePicture,
        isBusinessAccount: profile.isBusinessAccount || false,
        category: profile.category
      });
    }
  });

  // Add some realistic search results for common music-related searches
  const musicRelatedProfiles = [
    {
      username: `${searchTerm}music`,
      displayName: `${searchTerm} Music`,
      followers: Math.floor(Math.random() * 50000),
      verified: false,
      isBusinessAccount: true,
      category: 'Musician/Band'
    },
    {
      username: `${searchTerm}official`,
      displayName: `${searchTerm} Official`,
      followers: Math.floor(Math.random() * 100000),
      verified: Math.random() > 0.7,
      isBusinessAccount: true,
      category: 'Artist'
    }
  ];

  return [...mockSearchResults, ...musicRelatedProfiles].slice(0, 5);
}

// Get verification options from search results
export function getInstagramVerificationOptions(query: string): Promise<InstagramVerificationOption[]> {
  return searchInstagramForVerification(query);
}

// Enhanced validation with verification options
export async function validateInstagramHandleWithVerification(username: string): Promise<InstagramValidationResult> {
  const basicResult = await validateInstagramHandle(username);

  if (!basicResult.valid) {
    return basicResult;
  }

  // If username is taken, provide verification options
  if (!basicResult.available && basicResult.profile) {
    const verificationOptions = await searchInstagramForVerification(username.replace('@', ''));

    return {
      ...basicResult,
      verificationOptions: verificationOptions.slice(0, 3)
    };
  }

  return basicResult;
}

// Extract username from Instagram URL or handle
export function extractInstagramUsername(input: string): string {
  if (!input) return '';

  // Handle Instagram URLs
  const urlMatch = input.match(/(?:instagram\.com\/|@)([a-zA-Z0-9._]+)/);
  if (urlMatch) {
    return urlMatch[1];
  }

  // Handle plain usernames (with or without @)
  return input.replace('@', '').trim();
}
