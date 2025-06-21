import axios from 'axios';

// Mock API base URL - in production this would be your actual backend URL
const API_BASE_URL = 'https://api.winningdistro.com/v1';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    // Mock login - in production this would be a real API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'demo@artist.com' && password === 'demo123') {
          const mockResponse = {
            data: {
              token: 'mock_jwt_token_12345',
              user: {
                id: '1',
                email: 'demo@artist.com',
                name: 'Demo Artist',
                artistName: 'Demo Artist',
                avatar: null,
                plan: 'pro',
                verified: true,
                joinedAt: '2024-01-15T10:00:00Z',
              },
            },
          };
          resolve(mockResponse);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },

  register: async (data: {
    email: string;
    password: string;
    artistName: string;
    fullName: string;
    country: string;
  }) => {
    // Mock registration
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = {
          data: {
            token: 'mock_jwt_token_12345',
            user: {
              id: '1',
              email: data.email,
              name: data.fullName,
              artistName: data.artistName,
              avatar: null,
              plan: 'starter',
              verified: false,
              joinedAt: new Date().toISOString(),
            },
          },
        };
        resolve(mockResponse);
      }, 1500);
    });
  },

  logout: async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    return Promise.resolve();
  },

  getCurrentUser: async () => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      return Promise.resolve({ data: { user: JSON.parse(userData) } });
    }
    return Promise.reject(new Error('No user data found'));
  },
};

// Music upload API functions
export const musicAPI = {
  uploadTrack: async (file: File, metadata: any) => {
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('metadata', JSON.stringify(metadata));

    // Mock upload with progress simulation
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = {
          data: {
            id: Math.random().toString(36).substr(2, 9),
            filename: file.name,
            size: file.size,
            duration: Math.floor(Math.random() * 300) + 60, // 1-5 minutes
            format: file.name.split('.').pop(),
            isrc: `US-${Math.random().toString(36).substr(2, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
            status: 'processing',
            uploadedAt: new Date().toISOString(),
            ...metadata,
          },
        };
        resolve(mockResponse);
      }, 2000);
    });
  },

  getReleases: async () => {
    // Mock releases data
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockReleases = [
          {
            id: '1',
            title: 'Midnight Dreams',
            artist: 'Demo Artist',
            type: 'single',
            releaseDate: '2024-03-10',
            status: 'live',
            artwork: 'https://picsum.photos/300/300?random=1',
            tracks: [
              {
                id: '1',
                title: 'Midnight Dreams',
                duration: 234,
                isrc: 'US-ABC-24-12345',
                streams: 125847,
              },
            ],
            platforms: 12,
            totalStreams: 125847,
            revenue: 456.78,
          },
          {
            id: '2',
            title: 'Summer Vibes EP',
            artist: 'Demo Artist',
            type: 'ep',
            releaseDate: '2024-02-15',
            status: 'live',
            artwork: 'https://picsum.photos/300/300?random=2',
            tracks: [
              {
                id: '2',
                title: 'Summer Vibes',
                duration: 198,
                isrc: 'US-ABC-24-12346',
                streams: 89432,
              },
              {
                id: '3',
                title: 'Beach Party',
                duration: 212,
                isrc: 'US-ABC-24-12347',
                streams: 67234,
              },
            ],
            platforms: 12,
            totalStreams: 156666,
            revenue: 567.89,
          },
        ];
        resolve({ data: mockReleases });
      }, 800);
    });
  },

  generateISRC: async () => {
    // Mock ISRC generation
    return new Promise((resolve) => {
      setTimeout(() => {
        const isrc = `US-${Math.random().toString(36).substr(2, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
        resolve({ data: { isrc } });
      }, 500);
    });
  },

  generateUPC: async () => {
    // Mock UPC generation
    return new Promise((resolve) => {
      setTimeout(() => {
        const upc = Math.floor(Math.random() * 900000000000) + 100000000000;
        resolve({ data: { upc: upc.toString() } });
      }, 500);
    });
  },
};

// Analytics API functions
export const analyticsAPI = {
  getDashboardStats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockStats = {
          totalStreams: 1247891,
          monthlyRevenue: 3456.78,
          totalFollowers: 24567,
          countriesReached: 47,
          growth: {
            streams: 12.3,
            revenue: 8.7,
            followers: 15.2,
            countries: 3,
          },
        };
        resolve({ data: mockStats });
      }, 600);
    });
  },

  getStreamingData: async (timeRange: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const generateData = (days: number) => {
          const data = [];
          for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            data.push({
              date: date.toISOString().split('T')[0],
              streams: Math.floor(Math.random() * 10000) + 5000,
              revenue: Math.floor(Math.random() * 100) + 50,
              newFollowers: Math.floor(Math.random() * 200) + 10,
            });
          }
          return data;
        };

        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        resolve({ data: generateData(days) });
      }, 800);
    });
  },

  getPlatformBreakdown: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const platforms = [
          { name: 'Spotify', streams: 567234, percentage: 45.2, revenue: 1560.45 },
          { name: 'Apple Music', streams: 312156, percentage: 24.8, revenue: 892.34 },
          { name: 'YouTube Music', streams: 187293, percentage: 14.9, revenue: 423.12 },
          { name: 'Amazon Music', streams: 124862, percentage: 9.9, revenue: 289.67 },
          { name: 'Others', streams: 62431, percentage: 5.2, revenue: 134.23 },
        ];
        resolve({ data: platforms });
      }, 700);
    });
  },

  getTopTracks: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tracks = [
          {
            id: '1',
            title: 'Midnight Dreams',
            streams: 125847,
            revenue: 456.78,
            growth: 12.3,
          },
          {
            id: '2',
            title: 'Summer Vibes',
            streams: 89432,
            revenue: 324.56,
            growth: 8.7,
          },
          {
            id: '3',
            title: 'Beach Party',
            streams: 67234,
            revenue: 243.21,
            growth: -2.1,
          },
        ];
        resolve({ data: tracks });
      }, 600);
    });
  },
};

export default apiClient;
