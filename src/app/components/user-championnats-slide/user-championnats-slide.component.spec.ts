import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserChampionnatsSlideComponent } from './user-championnats-slide.component';

describe('UserChampionnatsSlideComponent', () => {
  let component: UserChampionnatsSlideComponent;
  let fixture: ComponentFixture<UserChampionnatsSlideComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserChampionnatsSlideComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserChampionnatsSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
