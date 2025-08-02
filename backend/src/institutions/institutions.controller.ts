import { Controller, Get,Post, Body, Patch, Param, UploadedFile, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { File as MulterFile } from 'multer';
import { InstitutionsService } from './institutions.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { CreateCertificateDto } from 'src/certificate/dto/create-certificate.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { User_Role } from 'src/interfaces/user.interface';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UUID } from 'crypto';


@Controller('institutions')
@UseGuards(RolesGuard)
@Roles(User_Role.Institute, User_Role.Admin)
export class InstitutionsController {
  constructor(
    private readonly institutionsService: InstitutionsService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() createInstitutionDto: CreateInstitutionDto, @Req() req) {

    const  initialInstituteAccount:CreateUserDto = {
      email: createInstitutionDto.email,
      password: `${createInstitutionDto.name}@123`,
      registrationType: 'email',
      role:'institution'
    }
    const user = await this.userService.createUser(initialInstituteAccount);

    return this.institutionsService.register(createInstitutionDto, user.id);
  }

  @Post('issue')
  issue(@Body() dto: CreateCertificateDto, @Req() req) {
    return this.institutionsService.issueCertificate(dto, req.user.sub);
  }

  @Get('certificates')
  listCertificates(@Req() req) {
    return this.institutionsService.getMyCertificates(req.user.sub);
  }

  @Patch('revoke/:id')
  revoke(@Param('id') id: UUID, @Req() req) {
    return this.institutionsService.revokeCertificate(id, req.user.sub);
  }
}
