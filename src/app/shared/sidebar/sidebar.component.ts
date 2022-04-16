import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  userName!: string;

  userNameSubs!: Subscription;

  constructor(private authService: AuthService, private route: Router, private store: Store<AppState>) { }
  

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

  logout() {
    this.authService.logout()
      .then(() => {
      
        this.route.navigate(['/login']);
    })
    .catch((err) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message
      })
    });
  }

}
