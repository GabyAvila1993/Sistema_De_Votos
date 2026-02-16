export class CreateElectionDto {
  name: string;
  date: string | Date;
  status?: 'upcoming' | 'active' | 'closed';
}
