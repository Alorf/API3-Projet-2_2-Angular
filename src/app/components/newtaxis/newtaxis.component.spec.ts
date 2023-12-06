import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewtaxisComponent } from './newtaxis.component';

describe('NewtaxisComponent', () => {
  let component: NewtaxisComponent;
  let fixture: ComponentFixture<NewtaxisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewtaxisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewtaxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
