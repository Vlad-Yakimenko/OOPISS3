import { Response } from '../response';
import { HttpMethodName } from '../enum';
import { Request } from '../request.interface';
import { AbstractController } from './controller.abstract';

const controllerUrl = '/someUrl';
const controllerMethod: HttpMethodName = HttpMethodName.GET; // it could be any Http Method

class TestAbstractContoller extends AbstractController {
  protected readonly url: string = controllerUrl;
  protected readonly method: HttpMethodName = controllerMethod;

  public async handle(req: Request, res: Response): Promise<Response> {
    throw new Error('This method should be tested for each controller, not here');
  }
}

describe('`AbstractController`', () => {
  let controller: TestAbstractContoller;

  beforeEach(() => {
    controller = new TestAbstractContoller();
  });

  it('`getMethod`', () => {
    expect(controller.getMethod()).toEqual(controllerMethod);
  });

  it('`getUrl`', () => {
    expect(controller.getUrl()).toEqual(controllerUrl);
  });
});