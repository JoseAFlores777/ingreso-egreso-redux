import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {

  userName!: string;
  userNameSubs!: Subscription;

  constructor(private store: Store<AppState>) { }
  
  ngOnDestroy(): void {
    this.userNameSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.userNameSubs = this.store.select('auth')
    .pipe(
      filter(({user}:any)=> user != null)
      )
      .subscribe(({ user }) => {
        this.userName = user.nombre;
    })
  }

}
