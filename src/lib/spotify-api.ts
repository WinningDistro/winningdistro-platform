// Spotify API integration for artist name availability checking
interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyArtist {
  id: string;
  name: string;
  popularity: number;
  followers: {
    total: number;
  };
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  external_urls: {
    spotify: string;
  };
}

interface SpotifySearchResponse {
  artists: {
    items: SpotifyArtist[];
    total: number;
  };
}

interface ArtistAvailabilityResult {
  available: boolean;
  exactMatch: boolean;
  similarArtists: SpotifyArtist[];
  suggestions: string[];
  searchResults?: SpotifyArtist[]; // For dropdown verification
}

interface ArtistVerificationOption {
  id: string;
  name: string;
  followers: number;
  imageUrl?: string;
  spotifyUrl: string;
  isVerified?: boolean;
}

// Get Spotify access token using client credentials flow
export async function getSpotifyAccessToken(): Promise<string> {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

  // For demo purposes, we'll use a public endpoint approach
  // In production, this should be handled by your backend
  if (!clientId || clientId === 'your_spotify_client_id_here') {
    console.warn('Spotify API credentials not configured, using mock data');
    return 'mock_token';
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error('Failed to get Spotify access token');
    }

    const data: SpotifyTokenResponse = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Spotify API token error:', error);
    throw new Error('Failed to authenticate with Spotify API');
  }
}

// Search for artists on Spotify
export async function searchSpotifyArtists(artistName: string): Promise<SpotifyArtist[]> {
  try {
    // Mock data for demo when API credentials not configured
    if (!import.meta.env.VITE_SPOTIFY_CLIENT_ID ||
        import.meta.env.VITE_SPOTIFY_CLIENT_ID === 'your_spotify_client_id_here') {

      // Return mock data for common artist names
      const commonNames = ['Drake', 'Taylor Swift', 'Ed Sheeran', 'Ariana Grande', 'The Weeknd'];
      const isCommonName = commonNames.some(name =>
        name.toLowerCase().includes(artistName.toLowerCase()) ||
        artistName.toLowerCase().includes(name.toLowerCase())
      );

      if (isCommonName) {
        return [{
          id: 'mock-id',
          name: artistName,
          popularity: 85,
          followers: { total: 50000000 },
          images: [{ url: '', height: 640, width: 640 }],
          external_urls: { spotify: 'https://open.spotify.com/artist/mock' }
        }];
      }
      return [];
    }

    const accessToken = await getSpotifyAccessToken();
    const encodedQuery = encodeURIComponent(`artist:"${artistName}"`);

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodedQuery}&type=artist&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search Spotify artists');
    }

    const data: SpotifySearchResponse = await response.json();
    return data.artists.items;
  } catch (error) {
    console.error('Spotify search error:', error);
    return [];
  }
}

// Check artist name availability and provide suggestions
export async function checkArtistNameAvailability(artistName: string): Promise<ArtistAvailabilityResult> {
  if (!artistName || artistName.trim().length < 2) {
    return {
      available: true,
      exactMatch: false,
      similarArtists: [],
      suggestions: []
    };
  }

  try {
    const artists = await searchSpotifyArtists(artistName.trim());

    // Check for exact match (case-insensitive)
    const exactMatch = artists.find(artist =>
      artist.name.toLowerCase() === artistName.toLowerCase()
    );

    // Find similar artists (partial matches)
    const similarArtists = artists.filter(artist =>
      artist.name.toLowerCase().includes(artistName.toLowerCase()) ||
      artistName.toLowerCase().includes(artist.name.toLowerCase())
    );

    // Generate suggestions if name is taken
    const suggestions: string[] = [];
    if (exactMatch || similarArtists.length > 0) {
      const baseName = artistName.trim();
      suggestions.push(
        `${baseName} Official`,
        `${baseName} Music`,
        `The ${baseName}`,
        `${baseName} Artist`,
        `${baseName}Music`
      );
    }

    return {
      available: !exactMatch,
      exactMatch: !!exactMatch,
      similarArtists: similarArtists.slice(0, 5), // Limit to top 5
      suggestions: suggestions.slice(0, 3), // Limit to 3 suggestions
      searchResults: artists.slice(0, 10) // For dropdown verification
    };
  } catch (error) {
    console.error('Error checking artist name availability:', error);
    // Return optimistic result on error
    return {
      available: true,
      exactMatch: false,
      similarArtists: [],
      suggestions: []
    };
  }
}

// Get artist verification options for dropdown selection
export function getArtistVerificationOptions(artists: SpotifyArtist[]): ArtistVerificationOption[] {
  return artists.map(artist => ({
    id: artist.id,
    name: artist.name,
    followers: artist.followers.total,
    imageUrl: artist.images[0]?.url,
    spotifyUrl: artist.external_urls.spotify,
    isVerified: artist.followers.total > 1000000 // Consider verified if >1M followers
  }));
}

// Enhanced search for artist verification
export async function searchArtistsForVerification(artistName: string): Promise<ArtistVerificationOption[]> {
  try {
    const artists = await searchSpotifyArtists(artistName);
    return getArtistVerificationOptions(artists);
  } catch (error) {
    console.error('Error searching artists for verification:', error);
    return [];
  }
}

// Debounced version for real-time checking
export function createDebouncedArtistCheck() {
  let timeoutId: NodeJS.Timeout;

  return function debouncedCheck(
    artistName: string,
    callback: (result: ArtistAvailabilityResult) => void,
    delay = 800
  ) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(async () => {
      const result = await checkArtistNameAvailability(artistName);
      callback(result);
    }, delay);
  };
}
