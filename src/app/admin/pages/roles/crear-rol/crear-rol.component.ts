import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { IPermiso } from '@data/permisos.metadata';
import { PermissionService } from 'src/app/admin/services/permission.service';
import { RolesService } from 'src/app/admin/services/roles.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear-rol',
  templateUrl: './crear-rol.component.html',
  styleUrls: ['./crear-rol.component.scss']
})
export class CrearRolComponent implements OnInit {
  public permissions: IPermiso[] = [];
  public roleForm!: FormGroup;
  public errorMessages: any = {};
  public groupedPermissions: { [key: string]: IPermiso[] } = {};

  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private roleService: RolesService,
    private router: Router,
    private notify:ToastrService,
  ) { }

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      permissions: this.fb.array([], Validators.required)
    });

    this.permissionService.Permissions().subscribe(
      (data: any) => {
        this.permissions = this.permissionService.handlePermissions(data);
        this.groupPermissions();
      },
      (error: any) => {
        this.errorMessages = this.permissionService.handleErrorPermissions(error.error.data);
      }
    );
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
      nombre: this.roleForm.value.nombre,
      permisos: this.roleForm.value.permissions.map((id: number) => ({ id }))
    };
   
    this.roleService.crearrol(formattedData).subscribe(
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
