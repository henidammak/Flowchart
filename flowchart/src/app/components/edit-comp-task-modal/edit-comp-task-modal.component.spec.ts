import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompTaskModalComponent } from './edit-comp-task-modal.component';

describe('EditCompTaskModalComponent', () => {
  let component: EditCompTaskModalComponent;
  let fixture: ComponentFixture<EditCompTaskModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCompTaskModalComponent]
    });
    fixture = TestBed.createComponent(EditCompTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
