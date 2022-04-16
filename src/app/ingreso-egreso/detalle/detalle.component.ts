import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import Swal from 'sweetalert2';
import { AppState } from '../../app.reducer';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos!: IngresoEgreso[];
  ingresosSubs!: Subscription;

  constructor(private store:Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService) { }

  ngOnDestroy(): void {
    this.ingresosSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.ingresosSubs = this.store.select('ingresosEgresos').subscribe(({ items }) => {
      this.ingresosEgresos = items;
    })
  }

  borrarItem({uid}:any) {
    this.ingresoEgresoService.borrarIngresoEgreso(uid)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: `Item Eliminado`,
        });
      }).catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        });
    })
  }

}
