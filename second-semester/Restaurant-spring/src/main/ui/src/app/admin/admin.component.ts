import {Component, OnInit} from '@angular/core';
// import {AuthService} from '../service/auth-service';
// import {ReservationService} from '../service/reservation.service';
// import {RoomService} from '../service/room.service';
// import {Room} from '../model/room';
// import {Reservation} from '../model/reservation';
import {Router} from '@angular/router';
import {AuthenticationService} from "../_services/authentication.service";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {

    // rooms: Room[];
    // reservations: Reservation[];
    selectedRoom: number;

    constructor(private authService: AuthenticationService,
                // private reservationService: ReservationService,
                // private roomsService: RoomService,
                private router: Router,
    ) {

    }

    ngOnInit(): void {
        // this.getAllReservations();
        // this.getAllRooms();
    }

    // getAllReservations(): void {
    //     this.reservationService.getAllReservations().pipe().subscribe(data => {
    //         this.reservations = data;
    //         console.log(data);
    //     });
    // }
    //
    // getAllRooms(): void {
    //     this.roomsService.getAllRooms().pipe().subscribe(data => {
    //         this.rooms = data;
    //         console.log(data);
    //     });
    // }
    //
    // updateReservation(id: number): void {
    //     console.log(id, this.selectedRoom);
    //     this.reservationService.updateReservation(this.selectedRoom, id).pipe().subscribe();
    // }

    onSelect(value: any): void {
        this.selectedRoom = value;
        console.log(this.selectedRoom);

    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
