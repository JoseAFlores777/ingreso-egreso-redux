import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as actions from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  ingresoForm!: FormGroup;
  tipo: string = 'Ingreso';
  ischarging: Boolean = false;
  uiSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store:Store<AppState>
  ) {}

  
  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      descripcion: ['', [Validators.required]],
      monto: ['', [Validators.required]],
    });
    
    this.uiSubscription = this.store.select('ui').subscribe((ui) => {
      this.ischarging = ui.isLoading;
    });
    
  }
  
    ngOnDestroy(): void {
      this.uiSubscription.unsubscribe();
    }

  guardar() {
    if (this.ingresoForm.invalid) {
      return;
    }

    const { descripcion, monto } = this.ingresoForm.value;

    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

    this.store.dispatch(actions.isLoading());

    this.ingresoEgresoService
      .crearIngresoEgreso(ingresoEgreso)
      .then((ref) => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: `${this.tipo} creado`,
        });
        this.store.dispatch(actions.stopLoading());
        this.ingresoForm.reset();
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        });
        this.store.dispatch(actions.stopLoading());
      });
  }
}
