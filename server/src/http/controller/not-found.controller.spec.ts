import { HttpStatusCode } from "../enum";
import { buildErrorResponse, NotFoundException } from "../error";
import { NotFoundController } from "./not-found.controller";

describe('`NotFoundController`', () => {
  let notFoundController: NotFoundController;

  beforeEach(() => {
    notFoundController = new NotFoundController();
  });

  it('should be instance of `NotFoundController`', () => {
    expect(notFoundController).toBeInstanceOf(NotFoundController);
  });

  describe('`handle`', () => {
    it('should return json response for `NotFoundException`', async () => {
      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };

      const errorResponse = buildErrorResponse(new NotFoundException('Page not found'));
      await expect(notFoundController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.NotFoundError);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });
  });
});