import { Controller, Get, Param, Post, UseFilters, UseGuards } from '@nestjs/common';
import { CandidatesummaryService } from './candidatesummary.service';
import { HttpExceptionFilter } from 'src/Exception/GlobalExceptionFilter';
import { FakeAuthGuard } from 'src/auth/fake-auth.guard';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { AuthUser } from 'src/auth/auth.types';

@Controller('candidates/:candidateId/summaries')
@UseFilters(HttpExceptionFilter)
@UseGuards(FakeAuthGuard)
export class CandidatesummaryController {
  constructor(private readonly candidatesummaryService: CandidatesummaryService) {}

  @Post('generate')
  async generate(
    @CurrentUser() user: AuthUser,
    @Param('candidateId') candidateId: string) {
    return this.candidatesummaryService.requestSummaryGeneration(user,candidateId);
  }

  @Get()
  async list(
    @CurrentUser() user: AuthUser,
    @Param('candidateId') candidateId: string) {
    return this.candidatesummaryService.listSummaries(user, candidateId);
  }

  @Get(':summaryId')
  async get(
    @CurrentUser() user: AuthUser,
    @Param('candidateId') candidateId: string,
    @Param('summaryId') summaryId: string,
  ) {
    return this.candidatesummaryService.getSummary(user, candidateId, summaryId);
  }
}
