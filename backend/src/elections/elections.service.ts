import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ElectionsService {
  constructor(private prisma: PrismaService) {}

  async create(createElectionDto: CreateElectionDto) {
    const data: Prisma.ElectionCreateInput = {
      name : createElectionDto.name,
      status : createElectionDto.status,
      date : new Date(createElectionDto.date)
    }
    return await this.prisma.election.create({
      data,
    });
  }

  async findAll() {
    return await this.prisma.election.findMany({
      include: { candidates: true },
    });
  }

  async findOne(id: number) {
    return await this.prisma.election.findUnique({
      where: { id },
      include: { candidates: true },
    });
  }

  async update(id: number, updateElectionDto: UpdateElectionDto) {
    return await this.prisma.election.update({
      where: { id },
      data: updateElectionDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.election.delete({
      where: { id },
    });
  }
}