import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  create(@Body() createVoteDto: CreateVoteDto) {
    return this.votesService.create(createVoteDto);
  }

  @Get()
  findAll(@Query('electionId') electionId?: string) {
    return this.votesService.findAll(electionId ? +electionId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.votesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.votesService.remove(+id);
  }
}
