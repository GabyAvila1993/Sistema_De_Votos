import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ElectionsModule } from './elections/elections.module';

@Module({
  imports: [PrismaModule, ElectionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
