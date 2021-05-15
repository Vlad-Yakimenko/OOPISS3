import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { User } from '../../shared/interface/user.interface';
import { AuthenticationService } from '../../service';
import { Country } from 'src/app/shared/enum';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error: string;

  Country: string[] = ['Ukraine', 'Poland', 'USA'];
  Currency: string[] = ['UAH'];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService,
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      country: ['', [Validators.required, Validators.minLength(1)]],
      currency: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  // convenience getter for easier access to the form fields
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log(this.findInvalidControls()); // for debugging purposes
      return;
    }

    this.loading = true;
    this.authenticationService.register(this.buildUser(this.registerForm.value))
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate(['/login'], { queryParams: { registered: true } });
        },
        (error) => {
          this.error = error;
          this.loading = false;
        });
  }

  private buildUser(value: any): User {
    const buildPhone = ((basePhone, country) => {
      let countryCode;

      if (country === Country.Ukraine) {
        countryCode = '38';
      } else if (country === Country.Poland) {
        countryCode = '48';
      } else if (country === Country.USA) {
        countryCode = '1';
      } else {
        throw new Error('No such country found');
      }

      return `${countryCode}${basePhone}`;
    });
    const user: User = {
      phone: buildPhone(value.phone, value.country),
      country: value.country,
      password: value.password,
      currency: value.currency,
    };
    console.log(user);
    return user;
  }

  private findInvalidControls(): any[] {
    const invalid = [];
    const controls = this.registerForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    return invalid;
  }
}
