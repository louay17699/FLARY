import { create } from 'zustand';
import { WALLPAPERS } from '../constants';
import { useAuthStore } from './useAuthStore';

export const useWallpaperStore = create((set, get) => ({
  selectedWallpaper: WALLPAPERS[0],
  blurIntensity: '4px',
  brightness: '0.9',
  customWallpapers: [],
  isUpdating: false,
  error: null,


initializeFromAuthUser: () => {
  try {
    set({ isUpdating: true, error: null });
    const { authUser } = useAuthStore.getState();
    
    if (authUser?.wallpaperSettings) {
      const wpSettings = authUser.wallpaperSettings;
      
      
      const customWPs = (wpSettings.customWallpapers || []).map(wp => ({
        ...wp,
        isCustom: true
      }));
      
      const selected = [...WALLPAPERS, ...customWPs]
        .find(wp => wp.id === wpSettings.selectedWallpaperId) || WALLPAPERS[0];
      
      set({
        selectedWallpaper: selected,
        blurIntensity: wpSettings.blurIntensity || '4px',
        brightness: wpSettings.brightness || '0.9',
        customWallpapers: customWPs,
        isUpdating: false
      });
    } else {
      set({
        selectedWallpaper: WALLPAPERS[0],
        blurIntensity: '4px',
        brightness: '0.9',
        customWallpapers: [],
        isUpdating: false
      });
    }
  } catch (error) {
    set({ 
      error: error.message || 'Failed to initialize wallpaper settings',
      isUpdating: false 
    });
  }
},

  setWallpaper: async (wallpaper) => {
    try {
      set({ isUpdating: true, error: null });
      await useAuthStore.getState().updateWallpaperSettings({
        selectedWallpaperId: wallpaper.id,
        blurIntensity: get().blurIntensity,
        brightness: get().brightness,
        customWallpapers: get().customWallpapers
      });
      set({ 
        selectedWallpaper: wallpaper, 
        isUpdating: false 
      });
    } catch (error) {
      set({ 
        error: error.message || 'Failed to update wallpaper',
        isUpdating: false 
      });
      throw error;
    }
  },

  setBlurIntensity: async (blur) => {
    try {
      set({ isUpdating: true, error: null });
      await useAuthStore.getState().updateWallpaperSettings({
        selectedWallpaperId: get().selectedWallpaper.id,
        blurIntensity: blur,
        brightness: get().brightness,
        customWallpapers: get().customWallpapers
      });
      set({ 
        blurIntensity: blur,
        isUpdating: false 
      });
    } catch (error) {
      set({ 
        error: error.message || 'Failed to update blur intensity',
        isUpdating: false 
      });
      throw error;
    }
  },

  setBrightness: async (brightness) => {
    try {
      set({ isUpdating: true, error: null });
      await useAuthStore.getState().updateWallpaperSettings({
        selectedWallpaperId: get().selectedWallpaper.id,
        blurIntensity: get().blurIntensity,
        brightness,
        customWallpapers: get().customWallpapers
      });
      set({ 
        brightness,
        isUpdating: false 
      });
    } catch (error) {
      set({ 
        error: error.message || 'Failed to update brightness',
        isUpdating: false 
      });
      throw error;
    }
  },

  addCustomWallpaper: async (wallpaper) => {
    try {
      set({ isUpdating: true, error: null });
      const newCustomWallpapers = [...get().customWallpapers, wallpaper];
      await useAuthStore.getState().updateWallpaperSettings({
        selectedWallpaperId: get().selectedWallpaper.id,
        blurIntensity: get().blurIntensity,
        brightness: get().brightness,
        customWallpapers: newCustomWallpapers
      });
      set({ 
        customWallpapers: newCustomWallpapers,
        isUpdating: false 
      });
    } catch (error) {
      set({ 
        error: error.message || 'Failed to add custom wallpaper',
        isUpdating: false 
      });
      throw error;
    }
  },

removeCustomWallpaper: async (id) => {
  try {
    set({ isUpdating: true, error: null });
    
   
    const wallpaperSettings = await useAuthStore.getState().deleteWallpaper(id);
   
    const selected = [...WALLPAPERS, ...(wallpaperSettings.customWallpapers || [])]
      .find(wp => wp.id === wallpaperSettings.selectedWallpaperId) || WALLPAPERS[0];
    
    set({ 
      customWallpapers: wallpaperSettings.customWallpapers || [],
      selectedWallpaper: selected,
      isUpdating: false 
    });
  } catch (error) {
    set({ 
      error: error.message || 'Failed to remove custom wallpaper',
      isUpdating: false 
    });
    throw error;
  }
},

  reset: () => {
    set({
      selectedWallpaper: WALLPAPERS[0],
      blurIntensity: '4px',
      brightness: '0.9',
      customWallpapers: [],
      error: null
    });
  }
}));