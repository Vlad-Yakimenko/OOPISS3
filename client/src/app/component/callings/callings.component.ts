import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { Role } from '../../shared/enum';
import { AuthenticationService, CallingService, UserService } from '../../service';
import { Calling } from '../../shared/interface';

@Component({
  selector: 'app-callings',
  templateUrl: './callings.component.html',
  styleUrls: ['./callings.component.scss']
})
export class CallingsComponent implements OnInit {
  incomingCallings: Calling[] = [];
  outgoingCallings: Calling[] = [];

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly callingService: CallingService,
  ) { }

  ngOnInit(): void {
    const userId = this.authenticationService.currentUserValue?.userId;
    this.callingService.getCallings(userId)
      .pipe(mergeMap(res => {
        const retrieveSendersInIncomingCallings = res.incomingCallings.map(calling => {
          return this.userService.getUserById(calling.senderId).pipe(
            map(sender => {
              calling.sender = sender;
              return calling;
            }),
          );
        });
        const retrieveReceiversInOutgoingCallings = res.outgoingCallings.map(calling => {
          return this.userService.getUserById(calling.receiverId).pipe(
            map(receiver => {
              calling.receiver = receiver;
              return calling;
            }),
          );
        });

        return forkJoin([
          ...retrieveSendersInIncomingCallings,
          ...retrieveReceiversInOutgoingCallings,
        ]).pipe(
          //tap(callings => console.log(callings)),
          map(callings => {
            const incomingCallings: Calling[] = [];
            const outgoingCallings: Calling[] = [];

            callings.forEach(calling => {
              calling.receiverId == userId
                ? incomingCallings.push(calling)
                : outgoingCallings.push(calling);
            });

            return {
              incomingCallings,
              outgoingCallings,
            }
          })
        );
      }))
      .subscribe((res) => {
        //console.log('result in subscribe: ', res);
        this.incomingCallings = res.incomingCallings;
        this.outgoingCallings = res.outgoingCallings;
      });
  }

  public isAdmin(): boolean {
    return this.authenticationService.currentUserValue.role === Role.Admin;
  }
}
