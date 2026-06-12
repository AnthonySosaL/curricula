import {
  Controller, Get, Patch, Delete, Body, Param, UseGuards, ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

interface AuthUser {
  id: string;
  role: string;
}

// Solo el propio usuario (o un ADMIN) puede ver/editar/borrar una cuenta
function assertSelfOrAdmin(user: AuthUser, targetId: string) {
  if (user.role !== 'ADMIN' && user.id !== targetId) {
    throw new ForbiddenException('No tienes permisos sobre este usuario');
  }
}

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Solo administradores pueden listar usuarios');
    }
    return this.usersService.findAll();
  }

  @Get('me')
  getProfile(@CurrentUser() user: AuthUser) {
    return this.usersService.findById(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    assertSelfOrAdmin(user, id);
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser() user: AuthUser) {
    assertSelfOrAdmin(user, id);
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    assertSelfOrAdmin(user, id);
    return this.usersService.remove(id);
  }
}
