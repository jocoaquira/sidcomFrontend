import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/authentication/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form={
    email: '',
    password: ''
  }
  public error=null;
  constructor(
    private authServices:AuthService,
    private router:Router,
  ) { }

  ngOnInit(): void {
  }
  onSubmit(){
    this.authServices.login(this.form).subscribe(r=>{
        if(r.error)
        {
          this.form.password='';
        }

    });
  }
  onSolicitar(){
    this.router.navigate(['/solicitud']);
  }

}
