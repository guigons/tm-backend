import FakeTPsRepository from '../repositories/fakes/FakeTPsRepository';
import LoadTPsSummaryService from './LoadTPsSummaryService';

let fakeTPsRepository: FakeTPsRepository;
let loadTPsSummary: LoadTPsSummaryService;

describe('LoadTPsSummary', () => {
  beforeEach(() => {
    fakeTPsRepository = new FakeTPsRepository();
    loadTPsSummary = new LoadTPsSummaryService(fakeTPsRepository);
  });
  it('shoul be able load TPs Summary', async () => {
    const response = await loadTPsSummary.execute({ ids: [123] });
    expect(response.tps[0]?.id).toBe(123);
  });
});
