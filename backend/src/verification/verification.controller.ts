import {
  Controller,
  Query,
  Get,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { VerificationService } from './verification.service';

@Controller('verify')
export class VerificationController {
  constructor(
    private readonly verificationService: VerificationService
  ) {}

  @Get()
  async verify(@Query('certificateId') certificateId: string, @Res() res: Response) {
    if (!certificateId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Missing certificateId parameter',
        data: null,
      });
    }

    try {
      const result = await this.verificationService.verifyCertificateById(certificateId);

      if (!result.valid) {
        return res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: result.reason,
          data: null,
        });
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Certificate is valid',
        data: result.certificate,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: error.message || 'Certificate not found',
        data: null,
      });
    }
  }
}
