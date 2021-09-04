import { TestBed } from '@angular/core/testing';

import { MusicFeedService } from './music-feed.service';

describe('MusicFeedService', () => {
  let service: MusicFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MusicFeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
