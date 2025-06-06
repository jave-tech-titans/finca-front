import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRequestsComponent } from './user-requests.component';

describe('UserRequestsComponent', () => {
  let component: UserRequestsComponent;
  let fixture: ComponentFixture<UserRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRequestsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
