export class Usuario {
  constructor(
    public uid: string,
    public nombre: string,
    public email: string
  ) { }
  
  static fromFirestore({email, uid, nombre}:any) {
    return new Usuario(email, uid, nombre)
  }
}
