import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditadressesComponent } from './editadresses.component';

describe('EditadressesComponent', () => {
  let component: EditadressesComponent;
  let fixture: ComponentFixture<EditadressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditadressesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditadressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
