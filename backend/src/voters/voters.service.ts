import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVoterDto } from './dto/create-voter.dto';
import { UpdateVoterDto } from './dto/update-voter.dto';

@Injectable()
export class VotersService {
  constructor(private prisma: PrismaService) {}

  async create(createVoterDto: CreateVoterDto) {
    return await this.prisma.voter.create({
      data: {
        name: createVoterDto.name,
        dni: createVoterDto.dni,
        role: createVoterDto.role || 'votar',
      },
    });
  }

  async findAll() {
    return await this.prisma.voter.findMany({
      select: {
        id: true,
        name: true,
        dni: true,
        role: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.voter.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        dni: true,
        role: true,
      },
    });
  }

  async findByDni(dni: string) {
    return await this.prisma.voter.findUnique({
      where: { dni },
    });
  }

  async update(id: number, updateVoterDto: UpdateVoterDto) {
    return await this.prisma.voter.update({
      where: { id },
      data: updateVoterDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.voter.delete({
      where: { id },
    });
  }
}
