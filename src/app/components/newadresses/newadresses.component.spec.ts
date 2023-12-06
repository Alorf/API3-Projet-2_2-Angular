import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewadressesComponent } from './newadresses.component';

describe('NewadressesComponent', () => {
  let component: NewadressesComponent;
  let fixture: ComponentFixture<NewadressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewadressesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewadressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
