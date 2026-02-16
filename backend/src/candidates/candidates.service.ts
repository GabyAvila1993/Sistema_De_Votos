import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

@Injectable()
export class CandidatesService {
  constructor(private prisma: PrismaService) {}

  async create(createCandidateDto: CreateCandidateDto) {
    // Verificar que la elección existe
    const election = await this.prisma.election.findUnique({
      where: { id: createCandidateDto.electionId },
    });

    if (!election) {
      throw new NotFoundException('Elección no encontrada');
    }

    return await this.prisma.candidate.create({
      data: {
        name: createCandidateDto.name,
        electionId: createCandidateDto.electionId,
      },
      include: { election: true },
    });
  }

  async findAll(electionId?: number) {
    const where = electionId ? { electionId } : {};
    return await this.prisma.candidate.findMany({
      where,
      include: { election: true },
    });
  }

  async findOne(id: number) {
    return await this.prisma.candidate.findUnique({
      where: { id },
      include: { election: true },
    });
  }

  async update(id: number, updateCandidateDto: UpdateCandidateDto) {
    return await this.prisma.candidate.update({
      where: { id },
      data: updateCandidateDto,
      include: { election: true },
    });
  }

  async remove(id: number) {
    return await this.prisma.candidate.delete({
      where: { id },
    });
  }
}
