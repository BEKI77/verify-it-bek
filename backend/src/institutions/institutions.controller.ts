import { Controller, Get,Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { CreateCertificateDto } from 'src/certificate/dto/create-certificate.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { User_Role } from 'src/interfaces/user.interface';
import { UserService } from 'src/user/user.service';
import { UUID } from 'crypto';
import { DecoderService } from 'src/decoder/decoder.service';


@Controller('institutions')
@UseGuards(RolesGuard)
@Roles(User_Role.Institute, User_Role.Admin)
export class InstitutionsController {
  constructor(
    private readonly institutionsService: InstitutionsService,
    private readonly decoderService: DecoderService
  ) {}
  

  @Post('issue')
  async issue(@Body() dto: CreateCertificateDto, @Req() req) {
    const user = this.decoderService.decode(req);
    return await this.institutionsService.issueCertificate(dto, user.userId);
  }

  @Get()
  async getInstituteInfo(@Req() req){
    return await this.institutionsService.getInfo(req);
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
