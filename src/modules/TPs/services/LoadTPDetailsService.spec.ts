import FakeTPsRepository from '@modules/TPs/repositories/fakes/FakeTPsRepository';
import LoadTPDetailsService from './LoadTPDetailsService';

let fakeTPsRepository: FakeTPsRepository;
let loadTPDetails: LoadTPDetailsService;

describe('LoadTPDetails', () => {
  beforeEach(() => {
    fakeTPsRepository = new FakeTPsRepository();
    loadTPDetails = new LoadTPDetailsService(fakeTPsRepository);
  });
  it('shoul be able load TP Detail', async () => {
    const response = await loadTPDetails.execute({ id: 123 });
    expect(response.tp?.id).toBe(123);
  });
});
