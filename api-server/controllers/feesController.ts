import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import fs from 'fs';
import path from 'path';

const configPath = path.join(__dirname, '../../data/feesConfig.json');

// Get fees config
export const getFeesConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!fs.existsSync(configPath)) {
      // Return default config if file somehow does not exist yet
      const defaults = {
        classes: {
          "Nursery": 15000,
          "LKG": 18000,
          "UKG": 18000,
          "Class I": 22000,
          "Class II": 22000,
          "Class III": 25000,
          "Class IV": 25000,
          "Class V": 25000,
          "Class VI": 30000,
          "Class VII": 30000,
          "Class VIII": 32000
        },
        addons: {
          "transport": 12000,
          "dress": 3500,
          "books": 4000
        }
      };
      res.status(200).json(defaults);
      return;
    }
    const rawData = fs.readFileSync(configPath, 'utf8');
    const data = JSON.parse(rawData);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: 'Error reading fees configuration', error: error.message });
  }
};

// Update fees config
export const updateFeesConfig = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { classes, addons } = req.body;

    if (!classes || !addons) {
      res.status(400).json({ message: 'Classes and Addons configurations are required.' });
      return;
    }

    const newConfig = { classes, addons };
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), 'utf8');

    res.status(200).json({ message: 'Fees configuration updated successfully!', config: newConfig });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating fees configuration', error: error.message });
  }
};
