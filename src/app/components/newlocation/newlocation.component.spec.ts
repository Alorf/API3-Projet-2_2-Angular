import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewlocationComponent } from './newlocation.component';

describe('NewlocationComponent', () => {
  let component: NewlocationComponent;
  let fixture: ComponentFixture<NewlocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewlocationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewlocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
