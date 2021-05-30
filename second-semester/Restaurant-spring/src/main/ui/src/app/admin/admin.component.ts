import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../_services/auth.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent {
  selectedRoom: number;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
}
