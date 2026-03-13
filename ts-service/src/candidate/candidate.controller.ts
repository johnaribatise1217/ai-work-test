import { Body, Controller, Get, Post, UseFilters, UseGuards } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { AuthUser } from 'src/auth/auth.types';
import { CreateCandidateDto } from './dto/CreateCandidateDto';
import { FakeAuthGuard } from 'src/auth/fake-auth.guard';
import { HttpExceptionFilter } from 'src/Exception/GlobalExceptionFilter';

@Controller('candidates')
@UseGuards(FakeAuthGuard)
@UseFilters(HttpExceptionFilter)
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Post('')
  async createUser(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateCandidateDto
  ){
    return this.candidateService.createCandidate(user, dto)
  }

  @Get('')
  async listCandidates(@CurrentUser() user: AuthUser){
    return this.candidateService.listCandidates(user)
  }
}
