import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExternalSessionNowLoaderPage } from './external-session-now-loader.page';

describe('ExternalSessionNowLoaderPage', () => {
  let component: ExternalSessionNowLoaderPage;
  let fixture: ComponentFixture<ExternalSessionNowLoaderPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalSessionNowLoaderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalSessionNowLoaderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
