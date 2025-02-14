import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPermisoRol } from '@data/permisos-por-rol.metadata';
import { IPermiso } from '@data/permisos.metadata';
import { PermissionService } from 'src/app/admin/services/permission.service';
import { RolesService } from 'src/app/admin/services/roles.service';

@Component({
  selector: 'app-editar-rol',
  templateUrl: './editar-rol.component.html',
  styleUrls: ['./editar-rol.component.scss']
})
export class EditarRolComponent implements OnInit {
  public permissions!:any[];
  public rolesAsign:any[]=[];
  public role!:IPermisoRol;
  public status:string='error';
  public error!:any;
  public id:any=0;

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
     // private notify: SnotifyService,
      private actRoute: ActivatedRoute,
      private router:Router
    ) {
      this.actRoute.paramMap.subscribe(
        params=>
        {
          this.id=params.get('id');
        }
      );
    }

    ngOnInit(): void {
      this.permissionService.Permissions().subscribe(
        (data:any)=>{
          this.permissions=this.permissionService.handlePermissions(data.data);
        },
        (error:any)=>this.error=this.permissionService.handleErrorPermissions(error.error.data)
      );
      this.roleService.verRole(this.id).subscribe(
        (data:any)=>{
          this.form=this.roleService.handleRole(data.data);
          this.rolesAsign=Object.values(this.form.permissions);
        },
        (error:any)=> this.error=this.roleService.handleErrorRole(error.error.data)
      );
    }
    onSubmitRol(){
      this.form.permissions=this.rolesAsign;
      this.roleService.editarrol(this.form).subscribe(
        (data:any) =>
        {
          let sw=this.roleService.handleEditarrol(data.data);
          this.status=data.status;
          if(this.status=='success')
          {
            this.router.navigate(['admin/rol']);
            //this.notify.success('Actualizado Correctamente');
          }
        },
        (error:any) =>
        {
          this.errorRole=this.roleService.handleEditarrolError(error.error.data);
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
    existeRol(id:any):boolean{
      let array=this.form.permissions;
      let sw=false;
      array.forEach(element => {
        if(element.id==id)
        {
          sw=true;
        }
      });
      return sw;
    }
}
