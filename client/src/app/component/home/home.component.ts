import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import {
  AuthenticationService, UserService,
  TariffService, CallingService,
} from '../../service';
import { Calling, User } from '../../shared/interface';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public user: User;
  public makeCallingForm: FormGroup;

  public errorMessage: string = null;
  public successfulMessage: string = null;
  public submitted: boolean = false;

  //public receiveUserError: string = null;

  constructor(
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService,
    private readonly tariffService: TariffService,
    private readonly callingService: CallingService,
    private readonly formBuilder: FormBuilder,
  ) {

  }

  // convenience getter for easy access to form fields
  get f() { return this.makeCallingForm.controls; }

  ngOnInit(): void {
    this.makeCallingForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      duration: ['', [Validators.required]]
    });

    this.userService
      .getUserById(this.authenticationService.currentUserValue?.userId)
      .subscribe(user => {
        this.user = user
      });
  }

  private isIntegerString(value: string): boolean {
    return !isNaN(parseInt(value)) && value.toString().indexOf('.') == -1;
  }

  onSubmit(): void {
    this.submitted = true;
    const duration = this.f.duration.value;

    if (this.f.username.value === this.user?.username) {
      this.errorMessage = 'You can not enter your username';
      return;
    }

    if (!this.isIntegerString(duration) || parseInt(duration) <= 0) {
      this.errorMessage = 'Duration should be positive integer';
      return;
    }
    const username = this.f.username.value;

    this.userService.getUserByUsername(username).pipe(
      mergeMap(receiver => {
        const loggedUserId = this.authenticationService.currentUserValue?.userId;
        return this.tariffService.getTariffs(loggedUserId).pipe(
          map(tariffs => tariffs.filter(tariff => tariff.country === receiver.country)),
          map(actualSenderTariffs => {
            let calling: Calling = {
              receiverId: receiver.id,
              senderId: loggedUserId,
              duration: duration,
            };
            return this.callingService.calculateCallingCost(calling, actualSenderTariffs)
          }),
          mergeMap(calling => {
            return this.callingService.addCallings(loggedUserId, [calling]).pipe(
              tap(() => {
                this.successfulMessage = `
                  Calling was added successfully. It was cost ${calling.cost} ${this.user?.bill?.currency}
                `;
                this.user.bill.balance -= calling.cost;
              }),
            );
          })
        )
      })
    ).subscribe(
      (data) => {
        this.submitted = false;
      },
      (err) => {
        this.errorMessage = err;
      },
    );
  }
}
