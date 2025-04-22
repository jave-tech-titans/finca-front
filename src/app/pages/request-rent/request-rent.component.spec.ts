import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestRentComponent } from './request-rent.component';

describe('RequestRentComponent', () => {
  let component: RequestRentComponent;
  let fixture: ComponentFixture<RequestRentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestRentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
