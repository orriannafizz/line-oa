import { Injectable } from '@nestjs/common';
import { Builder } from 'xml2js';

@Injectable()
export class XmlService {
  private builder = new Builder();

  toXml(object: any): string {
    return this.builder.buildObject(object);
  }
}
