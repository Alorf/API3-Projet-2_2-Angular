import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewfacturesComponent } from './newfactures.component';

describe('NewfacturesComponent', () => {
  let component: NewfacturesComponent;
  let fixture: ComponentFixture<NewfacturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewfacturesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewfacturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
