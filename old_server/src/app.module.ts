import { AbstractController } from '@app/http/controller/controller.abstract';
import {
  ChangeUserBalanceController, ChangeUserStatusController,
  GetUsersController, AddUserTariffsController,
} from '@app/http/controller/user';
import { GetTariffsController } from '@app/http/controller/tariff';
import { GetCallingsController, AddCallingsController } from '@app/http/controller/calling';
import { SignInController, SignUpController } from '@app/http/controller/auth';
import { HealthCheckController } from '@app/http/controller/health-check.controller';
import { NotFoundController } from '@app/http/controller/not-found.controller';

export class AppModule {
  private readonly controllers: ReadonlyArray<AbstractController>;
  constructor(
    private readonly healthCheckController: HealthCheckController = new HealthCheckController(),
    private readonly signUpController: SignUpController = new SignUpController(),
    private readonly signInController: SignInController = new SignInController(),
    private readonly getUsersController: GetUsersController = new GetUsersController(),
    private readonly changeUserStatusController: ChangeUserStatusController = new ChangeUserStatusController(),
    private readonly changeUserBalanceController: ChangeUserBalanceController = new ChangeUserBalanceController(),
    private readonly getTariffsController: GetTariffsController = new GetTariffsController(),
    private readonly addUserTariffsController: AddUserTariffsController = new AddUserTariffsController(),
    private readonly getCallingsController: GetCallingsController = new GetCallingsController(),
    private readonly addCallingsController: AddCallingsController = new AddCallingsController(),
    private readonly notFoundController: NotFoundController = new NotFoundController(),
  ) {
    this.controllers = [
      healthCheckController, signUpController,
      signInController, getUsersController,
      changeUserStatusController, changeUserBalanceController,
      getTariffsController, addUserTariffsController,
      getCallingsController, addCallingsController,
    ];
  }

  public findController(url: string, method: string): AbstractController {
    return this.controllers.find(controller => controller.getMethod() === method 
      && controller.getUrl() === url) || this.notFoundController;
  }
}