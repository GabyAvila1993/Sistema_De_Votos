import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ElectionsModule } from './elections/elections.module';
import { VotersModule } from './voters/voters.module';
import { VotesModule } from './votes/votes.module';
import { CandidatesModule } from './candidates/candidates.module';

@Module({
  imports: [PrismaModule, ElectionsModule, VotersModule, VotesModule, CandidatesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
