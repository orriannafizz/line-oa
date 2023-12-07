import { XmlService } from '../xml.service';

describe('XmlService', () => {
  let xmlService: XmlService;

  beforeEach(() => {
    xmlService = new XmlService();
  });

  it('should convert an object to XML string', () => {
    const testObject = {
      root: {
        title: 'Test Title',
        content: 'Test Content',
      },
    };

    const result = xmlService.toXml(testObject);
    expect(result).toContain('<root>');
    expect(result).toContain('<title>Test Title</title>');
    expect(result).toContain('<content>Test Content</content>');
    expect(result).toContain('</root>');
  });

  it('should handle empty object', () => {
    const testObject = {};

    const result = xmlService.toXml(testObject);
    expect(result).toContain('<root/>');
    expect(result).not.toContain('<root></root>');
  });
});
