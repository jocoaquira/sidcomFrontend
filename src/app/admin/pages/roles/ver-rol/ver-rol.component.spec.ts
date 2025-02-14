import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerRolComponent } from './ver-rol.component';

describe('VerRolComponent', () => {
  let component: VerRolComponent;
  let fixture: ComponentFixture<VerRolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerRolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
