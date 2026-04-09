import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async findAll(): Promise<UserEntity[]> {
    const users = await this.usersRepo.findAll();
    return users.map(UserEntity.fromPrisma);
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return UserEntity.fromPrisma(user);
  }

  async findByEmail(email: string) {
    return this.usersRepo.findByEmail(email);
  }

  async create(data: { email: string; name: string; password: string }) {
    const exists = await this.usersRepo.findByEmail(data.email);
    if (exists) throw new ConflictException('El email ya está registrado');
    const hashed = await bcryptjs.hash(data.password, 10);
    const user = await this.usersRepo.create({ ...data, password: hashed });
    return UserEntity.fromPrisma(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    await this.findById(id);
    if (dto.password) {
      dto.password = await bcryptjs.hash(dto.password, 10);
    }
    const updated = await this.usersRepo.update(id, dto);
    return UserEntity.fromPrisma(updated);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.usersRepo.delete(id);
  }
}
