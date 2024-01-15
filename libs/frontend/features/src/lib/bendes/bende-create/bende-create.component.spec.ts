import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BendeCreateComponent } from './bende-create.component';

describe('BendeCreateComponent', () => {
  let component: BendeCreateComponent;
  let fixture: ComponentFixture<BendeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BendeCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BendeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
