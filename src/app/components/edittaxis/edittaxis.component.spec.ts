import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdittaxisComponent } from './edittaxis.component';

describe('EdittaxisComponent', () => {
  let component: EdittaxisComponent;
  let fixture: ComponentFixture<EdittaxisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EdittaxisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EdittaxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
