import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeelnemerDetailComponent } from './deelnemer-detail.component';

describe('DeelnemerDetailComponent', () => {
  let component: DeelnemerDetailComponent;
  let fixture: ComponentFixture<DeelnemerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeelnemerDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeelnemerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
