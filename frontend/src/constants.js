// src/constants.js
export const WALLPAPERS = [
  {
    id: 'default',
    name: 'Default',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=',
    url: '',
    blur: 'none',
    brightness: '1'
  },
  {
    id: 'gradient',
    name: 'Soft Gradient',
    thumbnail: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    url: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    blur: '2px',
    brightness: '0.95'
  },
  {
    id: 'geometric',
    name: 'Geometric',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmNWY3ZmEiLz48cGF0aCBkPSJNMCAwTDUwIDBMNTAgNTBMMCA1MFoiIGZpbGw9IiNlZWUiLz48cGF0aCBkPSJNNTAgMEwxMDAgMEwxMDAgNTBMNTAgNTBaIiBmaWxsPSIjZGRkIi8+PC9zdmc+',
    url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmNWY3ZmEiLz48cGF0aCBkPSJNMCAwTDUwIDBMNTAgNTBMMCA1MFoiIGZpbGw9IiNlZWUiLz48cGF0aCBkPSJNNTAgMEwxMDAgMEwxMDAgNTBMNTAgNTBaIiBmaWxsPSIjZGRkIi8+PC9zdmc+',
    blur: '3px',
    brightness: '0.9'
  },
  {
    id: 'bubbles',
    name: 'Color Bubbles',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmNWY3ZmEiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxNSIgZmlsbD0iI2UzZjBmZiIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iMzAiIHI9IjIwIiBmaWxsPSIjZjBlOGY1Ii8+PGNpcmNsZSBjeD0iNDAiIGN5PSI2MCIgcj0iMjAiIGZpbGw9IiNlOGYwZjUiLz48L3N2Zz4=',
    url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmNWY3ZmEiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxNSIgZmlsbD0iI2UzZjBmZiIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iMzAiIHI9IjIwIiBmaWxsPSIjZjBlOGY1Ii8+PGNpcmNsZSBjeD0iNDAiIGN5PSI2MCIgcj0iMjAiIGZpbGw9IiNlOGYwZjUiLz48L3N2Zz4=',
    blur: '4px',
    brightness: '0.85'
  },
  {
    id: 'nature',
    name: 'Nature',
    thumbnail: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    url: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
    blur: '5px',
    brightness: '0.8'
  },
  {
    id: 'abstract',
    name: 'Abstract',
    thumbnail: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    url: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
    blur: '6px',
    brightness: '0.75'
  }
];

export const BLUR_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: '2px', label: 'Light' },
  { value: '4px', label: 'Medium' },
  { value: '8px', label: 'Strong' }
];

export const BRIGHTNESS_OPTIONS = [
  { value: '1', label: 'None' },
  { value: '0.95', label: 'Light' },
  { value: '0.85', label: 'Medium' },
  { value: '0.75', label: 'Strong' }
];

export const IMAGE_COMPRESSION_SETTINGS = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  mimeType: 'image/jpeg'
};