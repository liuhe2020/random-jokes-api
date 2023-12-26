import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JokesService } from './jokes.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { FindRandomDto } from './dto/findRandom.dto';
import { FindOneDto } from './dto/findOne.dto';
import { FindAllDto } from './dto/findAll.dto';

@Controller('jokes')
@UseGuards(ThrottlerGuard)
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
export class JokesController {
  constructor(private readonly jokesService: JokesService) {}

  @Get()
  findAll(@Query() query: FindAllDto) {
    return this.jokesService.findAll(query);
  }

  @Get('random')
  findRandom(@Query() query: FindRandomDto) {
    return this.jokesService.findRandom(query);
  }

  @Get(':id')
  findOne(@Param() param: FindOneDto) {
    return this.jokesService.findOne(param);
  }
}
