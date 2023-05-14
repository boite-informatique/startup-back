import { Controller } from '@nestjs/common';
import { DefenseDocService } from './defense-doc.service';

@Controller('defense-doc')
export class DefenseDocController {
    constructor(private readonly defenseDocService: DefenseDocService) {}
}
