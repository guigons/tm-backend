import FakeTAsRepository from '@modules/TAs/repositories/fakes/FakeTAsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import LoadTAsGroupService from './LoadTAsGroupService';

let fakeTAsRepository: FakeTAsRepository;
let fakeCacheProvider: FakeCacheProvider;
let loadTAsGroup: LoadTAsGroupService;

describe('LoadTAsGroup', () => {
  beforeEach(() => {
    fakeTAsRepository = new FakeTAsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    loadTAsGroup = new LoadTAsGroupService(
      fakeTAsRepository,
      fakeCacheProvider,
    );
  });
  it('shoul be able load TAs Summary', async () => {
    const response = await loadTAsGroup.execute();
    expect(response.group[0].grupoResponsavel).toBe('Fila');
    expect(response.group[0].data[9].count).toBe(1);
    expect(response.group[0].data[9].ids[0]).toBe(123);
    expect(response.group[0].total).toBe(1);
  });
});
