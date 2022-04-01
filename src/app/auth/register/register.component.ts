import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import * as actions from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm!: FormGroup;
  ischarging: boolean = false;
  uiSubscription!: Subscription;


  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router) { }


  ngOnInit(): void {

    this.registroForm = this.fb.group({
      nombre: ['',[Validators.required]],
      correo: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required]],
    })

    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.ischarging = ui.isLoading;
    })

  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe()
  }

  crearUsuario() {
    if (this.registroForm.invalid) { return; }

    const { nombre, correo, password } = this.registroForm.value;

    this.store.dispatch(actions.isLoading())

    this.authService.crearUsuario(nombre, correo, password)
      .then(credenciales => {
        console.log({ credenciales })
        this.store.dispatch(actions.stopLoading());
        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.store.dispatch(actions.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message
        })
      });
  }

}
