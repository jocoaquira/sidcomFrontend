import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPermisoRol } from '@data/permisos-por-rol.metadata';
import { CanCrearRolGuard } from 'src/app/admin/guards/roles/can-crear-rol.guard';
import { CanEditarRolGuard } from 'src/app/admin/guards/roles/can-editar-rol.guard';
import { CanEliminarRolGuard } from 'src/app/admin/guards/roles/can-eliminar-rol.guard';
import { RolesService } from 'src/app/admin/services/roles.service';

@Component({
  selector: 'app-listar-roles',
  templateUrl: './listar-roles.component.html',
  styleUrls: ['./listar-roles.component.scss']
})
export class ListarRolesComponent implements OnInit {

public roles!:IPermisoRol[];
public error!:any;
p: number = 1;

  constructor(
    private roleService:RolesService,
    private router: Router,
    public canCrearRol:CanCrearRolGuard,
    public canEditarRol:CanEditarRolGuard,
    public canEliminarRol:CanEliminarRolGuard,
  ) { }

  ngOnInit(): void {
    this.roleService.verRoles().subscribe(
      (data:any)=>{
        this.roles=this.roleService.handlerol(data);
        console.log(this.roles);
      },
      (error:any)=>this.error=this.roleService.handleErrorRole(error.error.data)
    );
  }
  openNew(){
    this.router.navigate(['/admin/roles/crear']);
  }
  edit(rol:IPermisoRol){
    this.router.navigate(['/admin/roles/editar/'+rol.id]);
  }

  dimension(permissions:any):boolean{

    if(permissions.length>0)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
  delete(id:any){
    this.roleService.eliminarRole(id).subscribe(
      (data:any)=>{
        let res=this.roleService.handleEliminarRole(data.data);
        if(res)
        {
          this.roles=this.roles.filter(role=>role.id!==id);
          //this.notify.success('Eliminado Correctamente');
        }
        else{
          //this.notify.error('No se pudo eliminar el rol');
        }
      },
      (error:any)=>this.error=this.roleService.handleEliminarRoleError(error.error.data)
    );
  }
      bloquearDialogo(rol:IPermisoRol){
          /*
          this.confirmationService.confirm({
              key: 'confirm1',
              message: '¿Estas seguro de Realizar esta Operación?',
              accept: () => {
                  if(pais.estado=='ACTIVO')
                      {
                          pais.estado='INACTIVO';
                      }
                      else{
                          pais.estado='ACTIVO';
                      }
                  this.paisService.editarpais(pais).subscribe(
                      (data:any) =>
                      {
                        this.paisService.handleCrearpais(data);
                        console.log(data);
                        if(data.error==null)
                        {
                          this.paisService.verpaiss('nada').subscribe(
                              (data:any)=>{
                              this.listaPaises=this.paisService.handlepais(data);
                              console.log(this.listaPaises);

                            },
                            (error:any)=> this.error=this.paisService.handleError(error));

                          this.notify.success('Actualizado Correctamente','Actualizado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
                        }
                      },
                      (error:any) =>
                      {
                        if(error.error.status=='fail')
                        {
                          this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con la Actualizacion',{timeOut:2000,positionClass: 'toast-top-right'});
                        }
                      }
                    );
                },
          });*/
      }

}
