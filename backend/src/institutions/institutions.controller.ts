import { Controller, Get,Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { CreateCertificateDto } from 'src/certificate/dto/create-certificate.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { DecoderService } from 'src/decoder/decoder.service';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { User_Role } from 'src/interfaces/user.interface';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';


@Controller('institutions')
@UseGuards(RolesGuard)
@Roles(User_Role.Institute, User_Role.Admin)
export class InstitutionsController {
  constructor(
    private readonly institutionsService: InstitutionsService,
    private readonly userService: UserService,
    private readonly decoderService: DecoderService
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
  revoke(@Param('id') id: string, @Req() req) {
    return this.institutionsService.revokeCertificate(parseInt(id), req.user.sub);
  }
}
