import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVoteDto } from './dto/create-vote.dto';

@Injectable()
export class VotesService {
  constructor(private prisma: PrismaService) {}

  async create(createVoteDto: CreateVoteDto) {
    // Validar que el votante existe
    const voter = await this.prisma.voter.findUnique({
      where: { id: createVoteDto.voterId },
    });

    if (!voter) {
      throw new NotFoundException('Votante no encontrado');
    }

    // Validar que el votante tenga rol para votar
    // Solo usuarios con rol 'votar' pueden emitir votos
    if (voter.role !== 'votar') {
      throw new BadRequestException('Solo usuarios con rol "votar" pueden emitir votos');
    }

    // Validar que la elección existe y está activa
    const election = await this.prisma.election.findUnique({
      where: { id: createVoteDto.electionId },
    });

    if (!election) {
      throw new NotFoundException('Elección no encontrada');
    }

    if (election.status !== 'active') {
      throw new BadRequestException('La elección no está activa');
    }

    // Validar que el candidato existe y pertenece a la elección
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: createVoteDto.candidateId },
    });

    if (!candidate || candidate.electionId !== createVoteDto.electionId) {
      throw new NotFoundException('Candidato no encontrado en esta elección');
    }

    // Validar que el votante no haya votado en esta elección antes (unique constraint)
    const existingVote = await this.prisma.vote.findUnique({
      where: {
        voterId_electionId: {
          voterId: createVoteDto.voterId,
          electionId: createVoteDto.electionId,
        },
      },
    });

    if (existingVote) {
      throw new BadRequestException('Este votante ya ha votado en esta elección');
    }

    // Crear el voto
    return await this.prisma.vote.create({
      data: {
        voterId: createVoteDto.voterId,
        electionId: createVoteDto.electionId,
        candidateId: createVoteDto.candidateId,
      },
      include: {
        voter: { select: { id: true, name: true } },
        candidate: { select: { id: true, name: true } },
        election: { select: { id: true, name: true } },
      },
    });
  }

  async findAll(electionId?: number) {
    const where = electionId ? { electionId } : {};
    return await this.prisma.vote.findMany({
      where,
      include: {
        voter: { select: { id: true, name: true, dni: true } },
        candidate: { select: { id: true, name: true } },
        election: { select: { id: true, name: true } },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.vote.findUnique({
      where: { id },
      include: {
        voter: { select: { id: true, name: true } },
        candidate: { select: { id: true, name: true } },
        election: { select: { id: true, name: true } },
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.vote.delete({
      where: { id },
    });
  }
}
