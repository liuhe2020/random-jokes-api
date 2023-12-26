import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindRandomDto } from './dto/findRandom.dto';
import { FindOneDto } from './dto/findOne.dto';
import { FindAllDto } from './dto/findAll.dto';
import { PG_CONNECTION } from 'src/constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { count, eq, inArray } from 'drizzle-orm';
import * as schema from '../database/schema';
import * as crypto from 'crypto';

@Injectable()
export class JokesService {
  constructor(
    @Inject(PG_CONNECTION) private conn: NodePgDatabase<typeof schema>,
  ) {}

  async findAll(query: FindAllDto) {
    const { page, type } = query;

    const countResult = type
      ? await this.conn
          .select({ value: count() })
          .from(schema.joke)
          .where(eq(schema.joke.type, type))
      : await this.conn.select({ value: count() }).from(schema.joke);

    const total = countResult[0].value;

    const results = await this.conn.query.joke.findMany({
      limit: 20,
      offset: (page - 1) * 20,
      ...(type && { where: eq(schema.joke.type, type) }),
    });

    const totalPage = Math.ceil(total / 20);

    if (type) {
      if (total && page > totalPage)
        throw new NotFoundException(
          `Requested page exceeds total pages ${totalPage}`,
        );
      if (!total)
        throw new NotFoundException(`Cannot find jokes for type '${type}'`);
    }

    if (page > totalPage)
      throw new BadRequestException(
        `Requested page exceeds total pages ${totalPage}`,
      );

    return {
      total,
      ...(type && { type }),
      totalPage,
      page,
      results,
    };
  }

  async findOne(param: FindOneDto) {
    const joke = await this.conn
      .select()
      .from(schema.joke)
      .where(eq(schema.joke.id, param.id));

    if (!joke.length)
      throw new NotFoundException(`Cannot find joke with id ${param.id}`);
    return joke;
  }

  async findRandom(query: FindRandomDto) {
    const countResult = await this.conn
      .select({ value: count() })
      .from(schema.joke);
    const total = countResult[0].value;
    const randomIds = [];

    const generateRandomId = () => {
      let id = crypto.randomBytes(4).readUInt32LE(0) % (total + 1);
      if (id === 0) {
        id++;
      }
      return id;
    };

    while (randomIds.length < query.limit) {
      const id = generateRandomId();
      if (!randomIds.includes(id)) randomIds.push(id);
    }

    return this.conn.query.joke.findMany({
      where: inArray(schema.joke.id, randomIds),
    });
  }
}
