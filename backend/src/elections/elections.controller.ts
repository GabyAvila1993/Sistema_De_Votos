import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ElectionsService } from './elections.service';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';

@Controller('elections')
export class ElectionsController {
  constructor(private readonly electionsService: ElectionsService) {}

  @Post()
  create(@Body() createElectionDto: CreateElectionDto) {
    return this.electionsService.create(createElectionDto);
  }

  @Get()
  findAll(
    @Query('status') status?: 'upcoming' | 'active' | 'closed',
    @Query('name') name?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters = {
      status,
      name,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    
    // Eliminar propiedades undefined
    Object.keys(filters).forEach(
      (key) => filters[key] === undefined && delete filters[key],
    );

    return this.electionsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.electionsService.findOne(+id);
  }

  @Get(':id/results')
  getResults(@Param('id') id: string, @Query('role') role?: string) {
    return this.electionsService.getResults(+id, role);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateElectionDto: UpdateElectionDto) {
    return this.electionsService.update(+id, updateElectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.electionsService.remove(+id);
  }
}
