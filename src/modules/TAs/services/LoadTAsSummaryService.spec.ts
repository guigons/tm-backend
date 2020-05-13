import FakeTAsRepository from '@modules/TAs/repositories/fakes/FakeTAsRepository';
import LoadTAsSummaryService from './LoadTAsSummaryService';

let fakeTAsRepository: FakeTAsRepository;
let loadTAsSummary: LoadTAsSummaryService;

describe('LoadTAsSummary', () => {
  beforeEach(() => {
    fakeTAsRepository = new FakeTAsRepository();
    loadTAsSummary = new LoadTAsSummaryService(fakeTAsRepository);
  });
  it('shoul be able load TAs Summary', async () => {
    const response = await loadTAsSummary.execute({ ids: [123] });
    expect(response.tas[0]?.id).toBe(123);
  });
});
