import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEmplyeeComponent } from './add-edit-emplyee.component';

describe('AddEditEmplyeeComponent', () => {
  let component: AddEditEmplyeeComponent;
  let fixture: ComponentFixture<AddEditEmplyeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditEmplyeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditEmplyeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
