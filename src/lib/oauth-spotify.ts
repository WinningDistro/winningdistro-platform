// Spotify OAuth authentication module
interface SpotifyOAuthConfig {
  clientId: string;
  redirectUri: string;
  scopes: string[];
}

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

interface SpotifyUserProfile {
  id: string;
  display_name: string;
  email: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  followers: {
    total: number;
  };
  external_urls: {
    spotify: string;
  };
  country: string;
  product: string; // "free" | "premium"
}

interface SpotifyArtistProfile {
  id: string;
  name: string;
  genres: string[];
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

interface SpotifyAuthResult {
  success: boolean;
  user?: SpotifyUserProfile;
  artist?: SpotifyArtistProfile;
  token?: string;
  error?: string;
}

// Get Spotify OAuth configuration
function getSpotifyConfig(): SpotifyOAuthConfig {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI ||
    `${window.location.origin}/auth/spotify/callback`;

  if (!clientId || clientId === 'your_spotify_client_id_here') {
    throw new Error('Spotify Client ID not configured. Please set VITE_SPOTIFY_CLIENT_ID in your environment variables.');
  }

  return {
    clientId,
    redirectUri,
    scopes: [
      'user-read-private',
      'user-read-email',
      'user-read-currently-playing',
      'user-read-playback-state',
      'user-top-read'
    ]
  };
}

// Generate OAuth authorization URL
export function getSpotifyAuthUrl(): string {
  try {
    const config = getSpotifyConfig();
    const state = generateRandomString(16);

    // Store state in sessionStorage for verification
    sessionStorage.setItem('spotify_auth_state', state);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      scope: config.scopes.join(' '),
      redirect_uri: config.redirectUri,
      state: state,
      show_dialog: 'true' // Force user to re-authenticate
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  } catch (error) {
    console.error('Error generating Spotify auth URL:', error);
    throw error;
  }
}

// Handle OAuth redirect and exchange code for token
export async function handleSpotifyCallback(code: string, state: string): Promise<SpotifyAuthResult> {
  try {
    // Verify state parameter
    const storedState = sessionStorage.getItem('spotify_auth_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    // Clear stored state
    sessionStorage.removeItem('spotify_auth_state');

    const config = getSpotifyConfig();

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${config.clientId}:${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: config.redirectUri
      })
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${error}`);
    }

    const tokenData: SpotifyTokenResponse = await tokenResponse.json();

    // Get user profile
    const userProfile = await getSpotifyUserProfile(tokenData.access_token);

    // Check if user is an artist (has artist profile)
    const artistProfile = await getUserArtistProfile(tokenData.access_token, userProfile.id);

    return {
      success: true,
      user: userProfile,
      artist: artistProfile || undefined,
      token: tokenData.access_token
    };

  } catch (error) {
    console.error('Spotify OAuth callback error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed'
    };
  }
}

// Get user profile from Spotify API
export async function getSpotifyUserProfile(accessToken: string): Promise<SpotifyUserProfile> {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return await response.json();
}

// Check if user has an artist profile
export async function getUserArtistProfile(accessToken: string, userId: string): Promise<SpotifyArtistProfile | null> {
  try {
    // Search for artist with the same name as user's display name
    const userProfile = await getSpotifyUserProfile(accessToken);

    if (!userProfile.display_name) {
      return null;
    }

    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=artist:"${encodeURIComponent(userProfile.display_name)}"&type=artist&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!searchResponse.ok) {
      return null;
    }

    const searchData = await searchResponse.json();

    // Look for exact match or user-controlled artist profile
    const artists = searchData.artists.items;
    const matchingArtist = artists.find((artist: SpotifyArtistProfile) =>
      artist.name.toLowerCase() === userProfile.display_name.toLowerCase()
    );

    return matchingArtist || null;

  } catch (error) {
    console.error('Error checking artist profile:', error);
    return null;
  }
}

// Initiate Spotify OAuth flow
export function signInWithSpotify(): void {
  try {
    const authUrl = getSpotifyAuthUrl();
    window.location.href = authUrl;
  } catch (error) {
    console.error('Failed to initiate Spotify OAuth:', error);
    throw error;
  }
}

// Get user's top tracks (for artist verification)
export async function getUserTopTracks(accessToken: string, limit = 20): Promise<any[]> {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=medium_term`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch top tracks');
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    return [];
  }
}

// Get user's playlists (for verification purposes)
export async function getUserPlaylists(accessToken: string, limit = 20): Promise<any[]> {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/playlists?limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch playlists');
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return [];
  }
}

// Utility function to generate random string for state parameter
function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

// Store OAuth token securely
export function storeSpotifyToken(token: string, expiresIn: number): void {
  const expirationTime = Date.now() + (expiresIn * 1000);

  localStorage.setItem('spotify_access_token', token);
  localStorage.setItem('spotify_token_expires', expirationTime.toString());
}

// Get stored OAuth token
export function getStoredSpotifyToken(): string | null {
  const token = localStorage.getItem('spotify_access_token');
  const expirationTime = localStorage.getItem('spotify_token_expires');

  if (!token || !expirationTime) {
    return null;
  }

  // Check if token is expired
  if (Date.now() > parseInt(expirationTime)) {
    clearSpotifyToken();
    return null;
  }

  return token;
}

// Clear stored OAuth token
export function clearSpotifyToken(): void {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_token_expires');
}

// Check if user is currently authenticated with Spotify
export function isSpotifyAuthenticated(): boolean {
  return getStoredSpotifyToken() !== null;
}
