import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDeviceModalComponent } from './new-device-modal.component';

describe('NewDeviceModalComponent', () => {
  let component: NewDeviceModalComponent;
  let fixture: ComponentFixture<NewDeviceModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewDeviceModalComponent]
    });
    fixture = TestBed.createComponent(NewDeviceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
