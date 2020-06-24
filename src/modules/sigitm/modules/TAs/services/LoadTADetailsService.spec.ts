import FakeTAsRepository from '../repositories/fakes/FakeTAsRepository';
import LoadTADetailsService from './LoadTADetailsService';

let fakeTAsRepository: FakeTAsRepository;
let loadTADetails: LoadTADetailsService;

describe('LoadTADetails', () => {
  beforeEach(() => {
    fakeTAsRepository = new FakeTAsRepository();
    loadTADetails = new LoadTADetailsService(fakeTAsRepository);
  });
  it('shoul be able load TA Detail', async () => {
    const response = await loadTADetails.execute({ id: 123 });
    expect(response.ta?.id).toBe(123);
  });
});
