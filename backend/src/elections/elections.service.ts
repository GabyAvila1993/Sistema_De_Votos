import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ElectionsService {
  constructor(private prisma: PrismaService) {}

  async create(createElectionDto: CreateElectionDto) {
    const data: Prisma.ElectionCreateInput = {
      name: createElectionDto.name,
      status: createElectionDto.status || 'upcoming',
      date: new Date(createElectionDto.date),
    };
    return await this.prisma.election.create({
      data,
      include: { candidates: true },
    });
  }

  async findAll(
    filters?: {
      status?: 'upcoming' | 'active' | 'closed';
      name?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const where: Prisma.ElectionWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.name) {
      where.name = {
        contains: filters.name,
      };
    }

    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters?.startDate) {
        where.date.gte = filters.startDate;
      }
      if (filters?.endDate) {
        where.date.lte = filters.endDate;
      }
    }

    return await this.prisma.election.findMany({
      where,
      include: {
        candidates: true,
        _count: {
          select: { votes: true },
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: number) {
    return await this.prisma.election.findUnique({
      where: { id },
      include: {
        candidates: true,
        votes: {
          include: {
            voter: { select: { id: true, name: true } },
            candidate: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async update(id: number, updateElectionDto: UpdateElectionDto) {
    return await this.prisma.election.update({
      where: { id },
      data: updateElectionDto,
      include: { candidates: true },
    });
  }

  async remove(id: number) {
    return await this.prisma.election.delete({
      where: { id },
    });
  }

  async getResults(id: number, userRole?: string) {
    // Solo admin puede ver resultados completos
    // NOTA: Esta validación debería venir de JWT/autenticación en producción
    if (!userRole || userRole !== 'admin') {
      throw new ForbiddenException(
        'Solo administradores pueden ver los resultados',
      );
    }

    const election = await this.prisma.election.findUnique({
      where: { id },
      include: {
        candidates: {
          include: {
            _count: {
              select: { votes: true },
            },
          },
        },
        _count: {
          select: { votes: true },
        },
      },
    });

    if (!election) {
      throw new NotFoundException('Elección no encontrada');
    }

    const totalVotes = election._count.votes;

    const results = election.candidates
      .map((candidate) => ({
        candidateId: candidate.id,
        candidateName: candidate.name,
        votes: candidate._count.votes,
        percentage: totalVotes > 0 ? (candidate._count.votes / totalVotes) * 100 : 0,
      }))
      .sort((a, b) => b.votes - a.votes);

    return {
      electionId: election.id,
      electionName: election.name,
      status: election.status,
      totalVotes,
      totalCandidates: election.candidates.length,
      results,
    };
  }
}