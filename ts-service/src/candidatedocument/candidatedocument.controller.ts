import { Controller, Param, Post, UploadedFile, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { CandidatedocumentService } from './candidatedocument.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FakeAuthGuard } from 'src/auth/fake-auth.guard';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { AuthUser } from 'src/auth/auth.types';
import { HttpExceptionFilter } from 'src/Exception/GlobalExceptionFilter';

@Controller('candidates/:candidateId/documents')
@UseFilters(HttpExceptionFilter)
@UseGuards(FakeAuthGuard)
export class CandidatedocumentController {
  constructor(
    private readonly candidatedocumentService: CandidatedocumentService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async uploadDocument(
    @CurrentUser() user: AuthUser,
    @Param("candidateId") candidateId: string,
    @UploadedFile() file: Express.Multer.File
  ){
    return this.candidatedocumentService.uploadDocument(user, candidateId, file)
  }
}
