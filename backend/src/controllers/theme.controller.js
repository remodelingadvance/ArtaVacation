import Theme from '../models/Theme.js';
import { uploadImage, deleteImage } from '../services/upload.service.js';
import mongoose from 'mongoose';

// @desc    Get active theme
export const getActiveTheme = async (req, res) => {
  try {
    const theme = await Theme.findOne({ isActive: true });

    if (!theme) {
      // Return default theme if none is active
      const defaultTheme = {
        name: 'Miami Summer',
        colors: {
          primary: '#0088ff',
          secondary: '#ff6b6b',
          accent: '#ffd93d',
          background: '#ffffff',
          text: '#1a1a2e',
          success: '#51cf66',
          error: '#ff6b6b',
          warning: '#ffd93d',
          info: '#0088ff',
        },
        animations: {
          enabled: true,
          speed: 'normal',
          particleEffect: true,
          floatingElements: true,
        },
      };

      return res.status(200).json({
        success: true,
        theme: defaultTheme,
      });
    }

    res.status(200).json({
      success: true,
      theme,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all themes
export const getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      themes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create theme
export const createTheme = async (req, res) => {
  try {
    const {
      name,
      colors,
      typography,
      animations,
      loader,
      navbar,
      banners,
      icons,
      seasonalDecorations,
      pageTransitions,
      neonEffects,
      overlay,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Theme name is required',
      });
    }

    const existingTheme = await Theme.findOne({ name });
    if (existingTheme) {
      return res.status(409).json({
        success: false,
        message: 'Theme with this name already exists',
      });
    }

    const theme = new Theme({
      name,
      colors,
      typography,
      animations,
      loader,
      navbar,
      banners,
      icons,
      seasonalDecorations,
      pageTransitions,
      neonEffects,
      overlay,
    });

    // Handle image uploads
    if (req.files) {
      if (req.files.backgroundImage) {
        const uploadedImage = await uploadImage(req.files.backgroundImage[0], 'luxury-rental/themes');
        theme.backgroundImage = {
          url: uploadedImage.url,
          public_id: uploadedImage.public_id,
        };
      }

      if (req.files.logoImage) {
        const uploadedLogo = await uploadImage(req.files.logoImage[0], 'luxury-rental/themes');
        theme.navbar.logoUrl = {
          url: uploadedLogo.url,
          public_id: uploadedLogo.public_id,
        };
      }

      if (req.files.bannerImage) {
        const uploadedBanner = await uploadImage(req.files.bannerImage[0], 'luxury-rental/themes');
        theme.banners.homeHero.imageUrl = {
          url: uploadedBanner.url,
          public_id: uploadedBanner.public_id,
        };
      }
    }

    await theme.save();

    res.status(201).json({
      success: true,
      message: 'Theme created successfully',
      theme,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update theme
export const updateTheme = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      colors,
      typography,
      animations,
      loader,
      navbar,
      banners,
      icons,
      seasonalDecorations,
      pageTransitions,
      neonEffects,
      overlay,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid theme ID',
      });
    }

    let theme = await Theme.findById(id);

    if (!theme) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found',
      });
    }

    // Update fields
    if (colors) theme.colors = colors;
    if (typography) theme.typography = typography;
    if (animations) theme.animations = animations;
    if (loader) theme.loader = loader;
    if (navbar) theme.navbar = { ...theme.navbar, ...navbar };
    if (banners) theme.banners = { ...theme.banners, ...banners };
    if (icons) theme.icons = icons;
    if (seasonalDecorations) theme.seasonalDecorations = seasonalDecorations;
    if (pageTransitions) theme.pageTransitions = pageTransitions;
    if (neonEffects) theme.neonEffects = neonEffects;
    if (overlay) theme.overlay = overlay;

    // Handle image uploads
    if (req.files) {
      if (req.files.backgroundImage) {
        if (theme.backgroundImage?.public_id) {
          await deleteImage(theme.backgroundImage.public_id);
        }
        const uploadedImage = await uploadImage(req.files.backgroundImage[0], 'luxury-rental/themes');
        theme.backgroundImage = {
          url: uploadedImage.url,
          public_id: uploadedImage.public_id,
        };
      }

      if (req.files.logoImage) {
        if (theme.navbar.logoUrl?.public_id) {
          await deleteImage(theme.navbar.logoUrl.public_id);
        }
        const uploadedLogo = await uploadImage(req.files.logoImage[0], 'luxury-rental/themes');
        theme.navbar.logoUrl = {
          url: uploadedLogo.url,
          public_id: uploadedLogo.public_id,
        };
      }

      if (req.files.bannerImage) {
        if (theme.banners.homeHero.imageUrl?.public_id) {
          await deleteImage(theme.banners.homeHero.imageUrl.public_id);
        }
        const uploadedBanner = await uploadImage(req.files.bannerImage[0], 'luxury-rental/themes');
        theme.banners.homeHero.imageUrl = {
          url: uploadedBanner.url,
          public_id: uploadedBanner.public_id,
        };
      }
    }

    theme = await theme.save();

    res.status(200).json({
      success: true,
      message: 'Theme updated successfully',
      theme,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Activate theme
export const activateTheme = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid theme ID',
      });
    }

    // Deactivate all themes
    await Theme.updateMany({}, { isActive: false });

    // Activate selected theme
    const theme = await Theme.findByIdAndUpdate(id, { isActive: true }, { new: true });

    if (!theme) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Theme activated successfully',
      theme,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete theme
export const deleteTheme = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid theme ID',
      });
    }

    const theme = await Theme.findById(id);

    if (!theme) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found',
      });
    }

    if (theme.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active theme. Activate another theme first.',
      });
    }

    // Delete images
    if (theme.backgroundImage?.public_id) {
      await deleteImage(theme.backgroundImage.public_id);
    }
    if (theme.navbar.logoUrl?.public_id) {
      await deleteImage(theme.navbar.logoUrl.public_id);
    }
    if (theme.banners.homeHero.imageUrl?.public_id) {
      await deleteImage(theme.banners.homeHero.imageUrl.public_id);
    }

    await Theme.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Theme deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};