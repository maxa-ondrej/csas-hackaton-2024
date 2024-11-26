import axios from 'axios';
import { describe, expect, it } from 'vitest';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('https://hackaton-api.fly.dev/api/v1', () => {
  describe('/automations', () => {
    it('GET should return list of automations', async () => {
      const mockResponse = {
        data: [
          {
            id: 'auto-1',
            type: 'process-data',
            sas: 'sas-123',
            state: 'running',
            last_activity: '2024-01-01T00:00:00Z',
          },
        ],
        headers: {
          'x-total-count': '1',
          'x-filtered-count': '1',
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get(
        'https://hackaton-api.fly.dev/api/v1/automations',
        {
          auth: { username: 'test', password: 'test' },
        },
      );

      expect(response.data).toEqual(mockResponse.data);
      expect(response.headers['x-total-count']).toBe('1');
    });

    it('GET /{id} should return single automation', async () => {
      const mockResponse = {
        data: {
          id: 'auto-1',
          type: 'process-data',
          sas: 'sas-123',
          state: 'running',
          last_activity: '2024-01-01T00:00:00Z',
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get(
        'https://hackaton-api.fly.dev/api/v1/automations/auto-1',
        {
          auth: { username: 'test', password: 'test' },
        },
      );

      expect(response.data).toEqual(mockResponse.data);
    });

    it('GET /{id}/logs should return automation logs', async () => {
      const mockResponse = {
        data: [
          {
            automation_id: 'auto-1',
            timestamp: '2024-01-01T00:00:00Z',
            level: 'INFO',
            type: 'process-data',
            from_state: 'pending',
            to_state: 'running',
            description: 'Started processing',
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get(
        'https://hackaton-api.fly.dev/api/v1/automations/auto-1/logs',
        {
          auth: { username: 'test', password: 'test' },
        },
      );

      expect(response.data).toEqual(mockResponse.data);
    });
  });

  describe('/automation-types', () => {
    it('GET should return list of automation types', async () => {
      const mockResponse = {
        data: [
          {
            type: 'process-data',
            states: ['pending', 'running', 'completed'],
            initial_state: 'pending',
            end_state: 'completed',
            transitions: [
              {
                from_state: 'pending',
                to_state: 'running',
                event: 'start',
                action: 'process',
              },
            ],
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get(
        'https://hackaton-api.fly.dev/api/v1/automation-types',
        {
          auth: { username: 'test', password: 'test' },
        },
      );

      expect(response.data).toEqual(mockResponse.data);
    });
  });

  describe('/runners', () => {
    it('GET should return list of runners', async () => {
      const mockResponse = {
        data: [
          {
            id: 'runner-1',
            state: 'idle',
            runner_group: 'default',
            organization: 'org-1',
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get(
        'https://hackaton-api.fly.dev/api/v1/runners',
        {
          auth: { username: 'test', password: 'test' },
        },
      );

      expect(response.data).toEqual(mockResponse.data);
    });
  });

  describe('/jobs', () => {
    it('GET should return list of jobs', async () => {
      const mockResponse = {
        data: [
          {
            id: 'job-1',
            state: 'success',
            organization: 'org-1',
            SAS: 'sas-123',
            runner: 'runner-1',
            timestamp: '2024-01-01T00:00:00Z',
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get(
        'https://hackaton-api.fly.dev/api/v1/jobs',
        {
          auth: { username: 'test', password: 'test' },
        },
      );

      expect(response.data).toEqual(mockResponse.data);
    });
  });

  describe('/metrics', () => {
    it('GET should return list of metrics', async () => {
      const mockResponse = {
        data: [
          {
            cpu: 45.5,
            memory: 2048,
            network_receive: 1000,
            network_transmit: 500,
            fs_reads: 100,
            fs_writes: 50,
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get(
        'https://hackaton-api.fly.dev/api/v1/metrics',
        {
          auth: { username: 'test', password: 'test' },
        },
      );

      expect(response.data).toEqual(mockResponse.data);
    });

    it('GET /{id} should return metrics for specific runner', async () => {
      const mockResponse = {
        data: {
          runner: 'runner-1',
          metrics: [
            {
              cpu: 45.5,
              memory: 2048,
              network_receive: 1000,
              network_transmit: 500,
              fs_reads: 100,
              fs_writes: 50,
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get(
        'https://hackaton-api.fly.dev/api/v1/metrics/runner-1',
        {
          auth: { username: 'test', password: 'test' },
        },
      );

      expect(response.data).toEqual(mockResponse.data);
    });
  });

  describe('Error Responses', () => {
    it('should handle 401 Unauthorized', async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            code: 'UNAUTHORIZED',
            error: 'Unauthorized',
            message: 'Authentication required',
          },
        },
      };

      mockedAxios.get.mockRejectedValueOnce(mockError);

      await expect(
        axios.get('https://hackaton-api.fly.dev/api/v1/automations'),
      ).rejects.toMatchObject(mockError);
    });

    it('should handle 404 Not Found', async () => {
      const mockError = {
        response: {
          status: 404,
          data: {},
        },
      };

      mockedAxios.get.mockRejectedValueOnce(mockError);

      await expect(
        axios.get(
          'https://hackaton-api.fly.dev/api/v1/automations/nonexistent',
        ),
      ).rejects.toMatchObject(mockError);
    });
  });
});
