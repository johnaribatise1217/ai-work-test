import { Module } from '@nestjs/common';

import { FakeSummarizationProvider } from './fake-summarization.provider';
import { SUMMARIZATION_PROVIDER } from './summarization-provider.interface';
import { GeminiSummarizationProvider } from './GeminiSummarizationProvider';

@Module({
  providers: [
    GeminiSummarizationProvider,
    {
      provide: SUMMARIZATION_PROVIDER,
      useExisting: GeminiSummarizationProvider,
    },
  ],
  exports: [SUMMARIZATION_PROVIDER, GeminiSummarizationProvider],
})
export class LlmModule {}
