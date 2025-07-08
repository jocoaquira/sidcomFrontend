import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { IPermiso } from '@data/permisos.metadata';
import { PermissionService } from 'src/app/admin/services/permission.service';
import { RolesService } from 'src/app/admin/services/roles.service';
import { ToastrService } from 'ngx-toastr';
import { IPermisoRol } from '@data/permisos-por-rol.metadata';

@Component({
  selector: 'app-editar-rol',
  templateUrl: './editar-rol.component.html',
  styleUrls: ['./editar-rol.component.scss']
})
export class EditarRolComponent implements OnInit {
  public permissions: IPermiso[] = [];
  public roleForm!: FormGroup;
  public errorMessages: any = {};
  public id:number=null;
  public error:any=null
  public groupedPermissions: { [key: string]: IPermiso[] } = {};

  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private roleService: RolesService,
    private router: Router,
    private notify:ToastrService,
    private actRoute:ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.actRoute.paramMap.subscribe(params => {
      this.id = parseInt(params.get('id') || '0', 10);

      // Inicializar el formulario antes de cargar datos
      this.roleForm = this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        permissions: this.fb.array([]) // Inicialmente vacío
      });

      this.roleService.verRole(this.id.toString()).subscribe(
        (data: any) => {
          let rol: IPermisoRol = this.roleService.handleRole(data);
        

          // Asignar valores al formulario
          this.roleForm.patchValue({
            id:rol.id,
            nombre: rol.nombre
        });

          // Cargar los permisos en el FormArray
          const selectedPermissions = this.roleForm.get('permissions') as FormArray;
          rol.permissions.forEach((permiso: any) => {
            selectedPermissions.push(this.fb.control(permiso.id));
          });

          // Cargar la lista de permisos disponibles
          this.permissionService.Permissions().subscribe(
            (data: any) => {
              this.permissions = this.permissionService.handlePermissions(data);
              this.groupPermissions();
            },
            (error: any) => {
              this.errorMessages = this.permissionService.handleErrorPermissions(error.error.data);
            }
          );
        },
        (error: any) => {
          this.error = this.roleService.handleErrorRole(error.error.data);
        }
      );
    });
  }


  // Agrupar permisos por la palabra entre "_"
  groupPermissions() {
    this.groupedPermissions = {};

    this.permissions.forEach((perm) => {
      const parts = perm.name.split('_');
      const key = parts.length > 1 ? parts[1] : parts[0];

      if (!this.groupedPermissions[key]) {
        this.groupedPermissions[key] = [];
      }
      this.groupedPermissions[key].push(perm);
    });
  }

  // Verificar si todos los permisos de un grupo están seleccionados
  isAllSelected(groupKey: string): boolean {
    const permissionsArray = this.roleForm.get('permissions') as FormArray;
    return this.groupedPermissions[groupKey].every(perm => permissionsArray.value.includes(perm.id));
  }

  // Seleccionar/deseleccionar todos los permisos de un grupo
  toggleAll(groupKey: string, event: any) {
    const isChecked = event.target.checked;
    const permissionsArray = this.roleForm.get('permissions') as FormArray;

    this.groupedPermissions[groupKey].forEach((perm) => {
      const index = permissionsArray.value.indexOf(perm.id);
      if (isChecked && index === -1) {
        permissionsArray.push(this.fb.control(perm.id));
      } else if (!isChecked && index !== -1) {
        permissionsArray.removeAt(index);
      }
    });
  }

  // Manejar el cambio de un permiso individual
  onChange(permission: IPermiso, event: any) {
    const permissionsArray = this.roleForm.get('permissions') as FormArray;
    const index = permissionsArray.value.indexOf(permission.id);

    if (event.target.checked && index === -1) {
      permissionsArray.push(this.fb.control(permission.id));
    } else if (!event.target.checked && index !== -1) {
      permissionsArray.removeAt(index);
    }
  }

// Método para enviar el formulario con el formato correcto
onSubmitRol() {
  
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    // Transformar permisos en el formato requerido
    const formattedData = {
        id:this.id,
      nombre: this.roleForm.value.nombre,
      permisos: this.roleForm.value.permissions.map((id: number) => ({ id }))
    };
  
    this.roleService.editarrol(formattedData).subscribe(
      (data: any) => {
        if (data) {
          this.notify.success('El Rol se generó exitosamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
          this.router.navigate(['admin/roles']);
        }
      },
      (error: any) => {
        this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});

      }
    );
  }

}

