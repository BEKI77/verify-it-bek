import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateInstitutionDto } from 'src/institutions/dto/create-institution.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { InstitutionsService } from 'src/institutions/institutions.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly institutionsService: InstitutionsService
  ) {}

  @Post('register')
  async registerInstitution(@Body() createInstitutionDto: CreateInstitutionDto, @Req() req) {
    const  initialInstituteAccount:CreateUserDto = {
      email: createInstitutionDto.email,
      imageUrl: '',
      password: `${createInstitutionDto.name}@123`.trim().toUpperCase(),
      registrationType: 'email',
      role:'institution'
    }
    const user = await this.userService.createUser(initialInstituteAccount);

    return await this.institutionsService.register(createInstitutionDto, user.id);
  }

  @Post('adminAccount')
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
