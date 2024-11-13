import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUsuario } from '@data/usuario.metadata';

export class UsuarioFormulario {
  usuario!: IUsuario;
  formulario: FormGroup;

  constructor() {
    this.usuario = {
        id: null,
        email: null,
        email_verified_at:null,
        nombre:null,
        apellidos:null,
        ci:null,
        celular:null,
        rol_id:null,
        operator_id:null,
        estado:null,
        created_at:null,
        updated_at:null,
        pass_gen:null,
        password:null,
        repetir_password:null
    };

    this.formulario = new FormGroup({
        email: new FormControl(this.usuario.email,[Validators.required,  Validators.email]),
        nombre:new FormControl(this.usuario.nombre,[Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]),
        apellidos:new FormControl(this.usuario.apellidos,[Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]),
        ci:new FormControl(this.usuario.ci,[Validators.required]),
        celular:new FormControl(this.usuario.celular,[Validators.required]),
        rol_id:new FormControl(this.usuario.rol_id,[Validators.required]),
        operator_id:new FormControl(this.usuario.operator_id,[Validators.required]),
        estado:new FormControl(this.usuario.estado,[Validators.required]),
        pass_gen:new FormControl(this.usuario.pass_gen,[Validators.required]),
        password:new FormControl(this.usuario.password,[Validators.required]),
        repetir_password:new FormControl(this.usuario,[Validators.required])
    });
  }

  // Método para obtener el control email
  get emailControl() {
    return this.formulario.get('email');
  }

  // Método para verificar si el campo email es inválido
  isEmailInvalid() {
    return this.emailControl?.invalid && (this.emailControl?.touched || this.emailControl?.dirty);
  }
}