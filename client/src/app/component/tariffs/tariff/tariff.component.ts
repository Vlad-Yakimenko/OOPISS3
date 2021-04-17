import {
  Component, EventEmitter, Input, OnInit, Output
} from '@angular/core';
import {
  FormBuilder, FormGroup
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  TariffService, UserService, AuthenticationService
} from '../../../service';
import { Tariff, User } from '../../../shared/interface';

@Component({
  selector: 'app-tariff',
  templateUrl: './tariff.component.html',
  styleUrls: ['./tariff.component.scss']
})
export class TariffComponent implements OnInit {
  @Input() tariff: Tariff;
  @Input() user: User;
  @Output() changedUser = new EventEmitter<User>();

  tariffForm: FormGroup;
  isAlreadyBought: boolean;
  errorDuringBuying: string;
  successfulMessage: string;

  constructor(
    private readonly tariffService: TariffService,
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService,
    private readonly formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.isAlreadyBoughtByUser()
      .subscribe(isBought => this.isAlreadyBought = isBought);

    this.tariffForm = this.formBuilder.group({}); // empty form with one button
  }

  private isAlreadyBoughtByUser(): Observable<boolean> {
    return this.tariffService.getTariffs(this.authenticationService.currentUserValue.userId)
      .pipe(
        map(tariffs => {
          return tariffs
            .filter(tariff => tariff.naming === this.tariff.naming).length > 0
            ? true : false;
        }));
  }

  onSubmit(): void {
    this.successfulMessage = null;

    if (this.tariff.cost > this.user.bill.balance) {
      this.errorDuringBuying = 'You do not have enough money to buy this tariff';
      return;
    }

    this.errorDuringBuying = null;
    this.userService.addTariffs(this.user.id, [this.tariff]).subscribe(
      (res) => {
        this.successfulMessage = 'Congratulations! You are successfully bought this tariff';
        this.user.bill.balance -= this.tariff.cost;
        this.changedUser.emit(this.user);
      }, (err) => {
        this.errorDuringBuying = err;
      });
  }
}
