import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Request, Response } from 'express';
import { 
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity
} from '../controllers/activities.controller';
import * as activityService from '../services/activity.service';
import { CustomRequest } from '../types/auth.type';

jest.mock('../lib/prisma', () => ({
  prisma: {
    activity: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Activity Controllers', () => {
  let mockReq: Partial<CustomRequest>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response;
    jest.clearAllMocks();
  });

  describe('getActivities', () => {
    it('should return all activities for an itinerary', async () => {
      const mockActivities = [
        { id: 1, activityName: 'Test Activity' }
      ];
      jest.spyOn(activityService, 'fetchActivities').mockResolvedValue(mockActivities as any);

      mockReq = {
        query: { itineraryId: '1' }
      };

      await getActivities(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ data: mockActivities });
    });

    it('should handle errors when fetching activities', async () => {
      jest.spyOn(activityService, 'fetchActivities').mockRejectedValue(new Error('Database error'));

      mockReq = {
        query: { itineraryId: '1' }
      };

      await getActivities(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({ 
        error: 'An error occurred while fetching activities.' 
      });
    });
  });

  describe('createActivity', () => {
    const validActivityData = {
      activityName: 'Test Activity',
      startTime: '2024-03-20T10:00:00Z',
      endTime: '2024-03-20T12:00:00Z',
      locationName: 'Test Location',
      address: 'Test Address',
      itineraryId: '1',
      date: '2024-03-20'
    };

    it('should create activity with valid data', async () => {
      const mockCreatedActivity = { id: 1, ...validActivityData };
      jest.spyOn(activityService, 'createNewActivity').mockResolvedValue(mockCreatedActivity as any);

      mockReq = {
        body: validActivityData,
        user: { id: 1, name: 'Test User', username: 'testuser' }
      };

      await createActivity(mockReq as CustomRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        data: mockCreatedActivity,
        message: 'Activity created successfully'
      });
    });

    it('should return 400 if required fields are missing', async () => {
      mockReq = {
        body: { activityName: 'Test Activity' },
        user: { id: 1, name: 'Test User', username: 'testuser' }
      };

      await createActivity(mockReq as CustomRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        error: 'Missing required fields'
      });
    });
  });

  describe('updateActivity', () => {
    const validUpdateData = {
      activityName: 'Updated Activity',
      startTime: '2024-03-20T10:00:00Z',
      endTime: '2024-03-20T12:00:00Z',
      locationName: 'Updated Location',
      address: 'Updated Address',
      itineraryId: '1',
      date: '2024-03-20'
    };

    it('should update activity with valid data', async () => {
      const mockUpdatedActivity = { id: 1, ...validUpdateData };
      jest.spyOn(activityService, 'updateExistingActivity').mockResolvedValue(mockUpdatedActivity as any);

      mockReq = {
        params: { id: '1' },
        body: validUpdateData,
        user: { id: 1, name: 'Test User', username: 'testuser' }
      };

      await updateActivity(mockReq as CustomRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        data: mockUpdatedActivity,
        message: 'Activity updated successfully'
      });
    });
  });

  describe('deleteActivity', () => {
    it('should successfully delete an activity', async () => {
      const mockDeletedActivity = { id: 1, activityName: 'Deleted Activity' };
      jest.spyOn(activityService, 'deleteActivityById').mockResolvedValue(mockDeletedActivity as any);

      mockReq = {
        params: { id: '1' }
      };

      await deleteActivity(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ data: mockDeletedActivity });
    });

    it('should handle errors when deleting activity', async () => {
      jest.spyOn(activityService, 'deleteActivityById').mockRejectedValue(new Error('Delete error'));

      mockReq = {
        params: { id: '1' }
      };

      await deleteActivity(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        error: 'An error occurred while deleting the activity.'
      });
    });
  });
}); 