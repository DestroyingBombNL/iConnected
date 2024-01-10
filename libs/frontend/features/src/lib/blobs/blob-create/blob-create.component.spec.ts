import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlobCreateComponent } from './blob-create.component';

describe('BlobCreateComponent', () => {
  let component: BlobCreateComponent;
  let fixture: ComponentFixture<BlobCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlobCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlobCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
