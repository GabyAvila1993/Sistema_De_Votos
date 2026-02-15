import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Evitamos tener que importarlo en cada módulo
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}