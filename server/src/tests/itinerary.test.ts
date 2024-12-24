import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Request, Response } from 'express';
import { 
  getItineraryByUserId, 
  createItinerary, 
  updateItinerary,
  deleteItinerary 
} from '../controllers/itineraries.controller';
import * as itineraryService from '../services/itinerary.service';
import { CustomRequest } from '../types/auth.type';

jest.mock('../lib/prisma', () => ({
  prisma: {
    itinerary: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('Itinerary Controllers', () => {
  let mockReq: Partial<CustomRequest>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response;
    jest.clearAllMocks();
  });

  describe('getItineraryByUserId', () => {
    it('should return unauthorized if no user ID is provided', async () => {
      mockReq = {
        user: undefined,
      };

      await getItineraryByUserId(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized access',
      });
    });

    it('should return itineraries for valid user', async () => {
      const mockItineraries = [{ id: 1, title: 'Test Itinerary' }];
      jest.spyOn(itineraryService, 'getUserItineraries').mockResolvedValue(mockItineraries as any);

      mockReq = {
        user: { id: 1, name: 'Test User', username: 'testuser' },
      };

      await getItineraryByUserId(mockReq as CustomRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockItineraries,
      });
    });
  });

  describe('createItinerary', () => {
    it('should return 400 if required fields are missing', async () => {
      mockReq = {
        body: { title: 'Test' },
        user: { id: 1, name: 'Test User', username: 'testuser' },
      };

      await createItinerary(mockReq as CustomRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        error: 'Missing required fields',
      });
    });

    it('should create itinerary with valid data', async () => {
      const mockItinerary = {
        title: 'Test Trip',
        description: 'Test Description',
        startDate: new Date(),
        endDate: new Date(),
      };

      jest.spyOn(itineraryService, 'createItineraryService').mockResolvedValue({
        ...mockItinerary,
        id: 1,
        createdById: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      } as any);

      mockReq = {
        body: mockItinerary,
        user: { id: 1, name: 'Test User', username: 'testuser' },
      };

      await createItinerary(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        data: expect.objectContaining(mockItinerary),
      });
    });
  });

  describe('updateItinerary', () => {
    it('should return error if itinerary update fails', async () => {
      jest.spyOn(itineraryService, 'updateItineraryService').mockResolvedValue({
        status: 403,
        error: true,
        message: 'Permission denied',
      });

      mockReq = {
        params: { id: '1' },
        body: { title: 'Updated Title' },
        user: { id: 2, name: 'Test User', username: 'testuser' },
      };

      await updateItinerary(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Permission denied',
      });
    });
  });

  describe('deleteItinerary', () => {
    it('should return error if deletion is not allowed', async () => {
      jest.spyOn(itineraryService, 'deleteItineraryService').mockResolvedValue({
        status: 400,
        error: true,
        message: 'You must delete related activities before deleting this itinerary.',
      });

      mockReq = {
        params: { id: '1' },
        user: { id: 1, name: 'Test User', username: 'testuser' },
      };

      await deleteItinerary(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'You must delete related activities before deleting this itinerary.',
      });
    });
  });
}); 