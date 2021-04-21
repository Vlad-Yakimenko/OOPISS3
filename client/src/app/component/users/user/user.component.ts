import {
  Component, Input, OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { UserService } from '../../../service';
import { User } from '../../../shared/interface';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @Input() abonent: User;

  userForm: FormGroup;
  submitted = false;
  errorMessage: string = null;
  successfulMessage: string = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
  ) { }

  // convenience getter for easy access to form fields
  get f() { return this.userForm.controls; }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      isConnected: ['', [Validators.required]],
      balance: ['', [Validators.required]]
    });
    
    this.userForm.get('balance').setValue(this.abonent.bill.balance);
    this.userForm.get('isConnected').setValue(this.abonent.isConnected ? 'yes' : 'no');
  }

  private findInvalidControls(): any[] {
    const invalid = [];
    const controls = this.userForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    return invalid;
  }

  onSubmit() {
    this.successfulMessage = null;
    this.errorMessage = null;
    this.submitted = true;

    // stop here if form is invalid
    if (this.userForm.invalid) {
      console.log(this.findInvalidControls());
      return;
    }

    const newUserStatus: boolean = this.f.isConnected.value === 'yes' ? true : false;
    const isStatusChanged: boolean = this.abonent.isConnected !== newUserStatus;

    if (isStatusChanged) {
      this.abonent.isConnected = newUserStatus;
    }

    this.abonent.bill.balance = this.f.balance.value;

    forkJoin([
      this.userService.changeUserBalance(this.abonent.id, this.abonent.bill.balance),
      isStatusChanged ? this.userService.changeUserStatus(this.abonent.id) : of(null),
    ]).subscribe(
      (data) => {
        this.successfulMessage = 'User was changed successfully';
        this.errorMessage = null;
      },
      (err) => {
        this.errorMessage = err;
        this.successfulMessage = null;
      });
  }
}
