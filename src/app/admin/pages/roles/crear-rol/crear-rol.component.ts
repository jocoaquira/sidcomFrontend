import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPermisoRol } from '@data/permisos-por-rol.metadata';
import { IPermiso } from '@data/permisos.metadata';
import { PermissionService } from 'src/app/admin/services/permission.service';
import { RolesService } from 'src/app/admin/services/roles.service';

@Component({
  selector: 'app-crear-rol',
  templateUrl: './crear-rol.component.html',
  styleUrls: ['./crear-rol.component.scss']
})
export class CrearRolComponent implements OnInit {
public permissions!:any[];
public rolesAsign:any[]=[];
public role!:IPermisoRol;
public status:string='error';
public error!:any;

public form:IPermisoRol={
  id:null,
  nombre: '',
  permissions:[],
};
public errorRole={
  nombre:null,
  permissions:null,
};

  constructor(
    private permissionService:PermissionService,
    private roleService:RolesService,
    //private notify: SnotifyService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.permissionService.Permissions().subscribe(
      (data:any)=>{
        this.permissions=this.permissionService.handlePermissions(data.data);
      },
      (error:any)=>this.error=this.permissionService.handleErrorPermissions(error.error.data)
    );
  }
  onSubmitRol(){
    this.form.permissions=this.rolesAsign;
    this.roleService.crearrol(this.form).subscribe(
      (data:any) =>
      {
        this.role=this.roleService.handleCrearrol(data.data);
        this.status=data.status;
        if(this.status=='success')
        {
          this.router.navigate(['admin/rol/editar/'+this.role.id]);
          //this.notify.success('Actualizado Correctamente');
        }
      },
      (error:any) =>
      {
        this.errorRole=this.roleService.handleCrearrolError(error.error.data);
        this.status=error.error.status;
        if(this.status=='fail')
        {
          //this.notify.error('Falló...Revise los campos y vuelva a enviar....');
        }
      }
    );
  }
  onChange(rol: IPermiso, isChecked: any) {

    if (isChecked.target.checked) {
      this.rolesAsign.push(rol);
    } else {
      const index = this.rolesAsign.findIndex(x => x.id === rol.id);
      this.rolesAsign=this.rolesAsign.filter(role=>role.id!==rol.id);
    }
  }
}
