import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IngresoEgresoService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const uid = this.authService.user.uid;
   return  this.firestore
      .doc(`/${uid}/ingresos-egresos`)
      .collection('items')
      .add({ ...ingresoEgreso });

  }

  initIngresosEgresosListener(uid?:string) {
    
   return  this.firestore.collection(`${uid}/ingresos-egresos/items`)
      .valueChanges({ idField: 'uid' })
/*       .snapshotChanges()
      .pipe(
        map(snapshot => {
          console.log(snapshot)
          return snapshot.map(doc => {
            const data:any = doc.payload.doc.data();
            return {
              uid: doc.payload.doc.id,
              ...data
            }
          })
        })
      ) */

  }

  borrarIngresoEgreso(uidItem?: string) {
    const userId = this.authService.user.uid;
    return this.firestore.doc(`${userId}/ingresos-egresos/items/${uidItem}`).delete();
  }


}
