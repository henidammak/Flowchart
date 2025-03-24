import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceListModalComponent } from './device-list-modal.component';

describe('DeviceListModalComponent', () => {
  let component: DeviceListModalComponent;
  let fixture: ComponentFixture<DeviceListModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceListModalComponent]
    });
    fixture = TestBed.createComponent(DeviceListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
