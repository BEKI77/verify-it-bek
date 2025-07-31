import { Controller, Get,Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { CreateCertificateDto } from 'src/certificate/dto/create-certificate.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { DecoderService } from 'src/decoder/decoder.service';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { User_Role } from 'src/interfaces/user.interface';


@Controller('institutions')
@UseGuards(RolesGuard)
@Roles(User_Role.Institute, User_Role.Admin)
export class InstitutionsController {
  constructor(
    private readonly institutionsService: InstitutionsService,
    private readonly decoderService: DecoderService
  ) {}

  @Post('register')
  register(@Body() createInstitutionDto: CreateInstitutionDto, @Req() req) {
    const user = this.decoderService.decode(req);
    return this.institutionsService.register(createInstitutionDto, user.userId);
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
