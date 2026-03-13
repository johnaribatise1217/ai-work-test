import { Test, TestingModule } from '@nestjs/testing';
import { CandidateService } from './candidate.service';
import { Repository } from 'typeorm';
import { Candidate } from './entity/candidate.entity';
import { Workspace } from './entity/workspace.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CandidateService', () => {
  let service: CandidateService;
  let candidateRepo: jest.Mocked<Repository<Candidate>>;
  let workspaceRepo: jest.Mocked<Repository<Workspace>>;

  const mockCandidateRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockWorkspaceRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidateService,
        {
          provide: getRepositoryToken(Candidate),
          useValue: mockCandidateRepo,
        },
        {
          provide: getRepositoryToken(Workspace),
          useValue: mockWorkspaceRepo,
        },
      ],
    }).compile();

    service = module.get<CandidateService>(CandidateService);
    candidateRepo = module.get(getRepositoryToken(Candidate));
    workspaceRepo = module.get(getRepositoryToken(Workspace));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a candidate', async () => {
    const user = {
      userId: 'user-1',
      workspaceId: 'workspace-1',
    };

    const dto = {
      fullName: 'John Aribatise',
      email: 'john@test.com',
      phoneNumber: '123456789',
    };

    workspaceRepo.findOne.mockResolvedValue(null);
    workspaceRepo.create.mockReturnValue({ id: 'workspace-1', name: 'Workspace workspace-1' } as any);
    workspaceRepo.save.mockResolvedValue({} as any);

    candidateRepo.create.mockReturnValue({ ...dto } as any);
    candidateRepo.save.mockResolvedValue({ id: 'candidate-1', ...dto } as any);

    const result = await service.createCandidate(user as any, dto as any);

    expect(candidateRepo.create).toHaveBeenCalled();
    expect(candidateRepo.save).toHaveBeenCalled();
    expect(result.email).toBe(dto.email);
  });

  it('should return candidates for a workspace', async () => {
    const user = {
      userId: 'user-1',
      workspaceId: 'workspace-1',
    };

    const candidates = [
      { id: '1', fullName: 'John Doe' },
      { id: '2', fullName: 'Jane Doe' },
    ];

    candidateRepo.find.mockResolvedValue(candidates as any);

    const result = await service.listCandidates(user as any);

    expect(candidateRepo.find).toHaveBeenCalledWith({
      where: { workspaceId: user.workspaceId },
      order: { createdAt: 'DESC' },
    });

    expect(result.length).toBe(2);
  });

  it('should throw an error when email already exists', async () => {
    const user = {
      userId: 'recruiter-1',
      workspaceId: 'workspace-1',
    };

    const dto = {
      fullName: 'John Doe',
      email: 'john@test.com',
      phoneNumber: '123456789',
    };

    // workspace already exists
    workspaceRepo.findOne.mockResolvedValue({
      id: 'workspace-1',
      name: 'Workspace workspace-1',
    } as any);

    candidateRepo.create.mockReturnValue(dto as any);

    // simulate database unique constraint error
    candidateRepo.save.mockRejectedValue(
      new Error('duplicate key value violates unique constraint "email"')
    );

    await expect(
      service.createCandidate(user as any, dto as any)
    ).rejects.toThrow('duplicate key value');
  });
});
