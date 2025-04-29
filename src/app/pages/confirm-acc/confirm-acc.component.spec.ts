import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAccComponent } from './confirm-acc.component';

describe('ConfirmAccComponent', () => {
  let component: ConfirmAccComponent;
  let fixture: ComponentFixture<ConfirmAccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmAccComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
