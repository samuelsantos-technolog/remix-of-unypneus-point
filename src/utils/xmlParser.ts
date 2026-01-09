import { ParsedXML, XMLProduct } from '@/types/inventory';
import { products } from '@/data/inventoryMockData';

export const parseNFeXML = (xmlString: string): ParsedXML | null => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      console.error('XML parsing error:', parserError.textContent);
      return null;
    }

    // Extract NFe key
    const infNFe = xmlDoc.querySelector('infNFe');
    const nfeKey = infNFe?.getAttribute('Id')?.replace('NFe', '') || '';
    
    // Extract NFe number
    const nNF = xmlDoc.querySelector('ide nNF');
    const nfeNumber = nNF?.textContent || '';

    // Extract issue date
    const dhEmi = xmlDoc.querySelector('ide dhEmi');
    const issueDate = dhEmi?.textContent || '';

    // Extract supplier info
    const emit = xmlDoc.querySelector('emit');
    const supplierCNPJ = emit?.querySelector('CNPJ')?.textContent || '';
    const supplierName = emit?.querySelector('xNome')?.textContent || '';
    const supplierTradeName = emit?.querySelector('xFant')?.textContent || supplierName;

    // Extract products
    const detElements = xmlDoc.querySelectorAll('det');
    const parsedProducts: XMLProduct[] = [];
    
    detElements.forEach((det) => {
      const prod = det.querySelector('prod');
      if (prod) {
        const code = prod.querySelector('cProd')?.textContent || '';
        const description = prod.querySelector('xProd')?.textContent || '';
        const ncm = prod.querySelector('NCM')?.textContent || '';
        const cfop = prod.querySelector('CFOP')?.textContent || '';
        const quantity = parseFloat(prod.querySelector('qCom')?.textContent || '0');
        const unitValue = parseFloat(prod.querySelector('vUnCom')?.textContent || '0');
        const totalValue = parseFloat(prod.querySelector('vProd')?.textContent || '0');

        // Try to match with existing product
        const existingProduct = products.find(p => 
          p.description.toLowerCase().includes(description.toLowerCase().split(' ')[0]) ||
          p.code === code
        );

        parsedProducts.push({
          code,
          description,
          ncm,
          cfop,
          quantity,
          unitValue,
          totalValue,
          existingProductId: existingProduct?.id,
          isNew: !existingProduct
        });
      }
    });

    // Calculate total value
    const totalElement = xmlDoc.querySelector('ICMSTot vNF');
    const totalValue = parseFloat(totalElement?.textContent || '0');

    return {
      nfeKey,
      nfeNumber,
      supplier: {
        cnpj: supplierCNPJ,
        name: supplierName,
        tradeName: supplierTradeName
      },
      products: parsedProducts,
      totalValue,
      issueDate
    };
  } catch (error) {
    console.error('Error parsing XML:', error);
    return null;
  }
};

// Sample XML for testing
export const sampleNFeXML = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe xmlns="http://www.portalfiscal.inf.br/nfe">
    <infNFe Id="NFe35231012345678000190550010001236561234567892" versao="4.00">
      <ide>
        <nNF>001236</nNF>
        <dhEmi>2023-10-15T10:30:00-03:00</dhEmi>
      </ide>
      <emit>
        <CNPJ>11222333000144</CNPJ>
        <xNome>Distribuidora Nacional de Pneus Ltda</xNome>
        <xFant>DNP Pneus</xFant>
      </emit>
      <det nItem="1">
        <prod>
          <cProd>PN001</cProd>
          <xProd>Pneu Pirelli Cinturato P1 185/65 R15</xProd>
          <NCM>40111000</NCM>
          <CFOP>5102</CFOP>
          <qCom>10</qCom>
          <vUnCom>250.00</vUnCom>
          <vProd>2500.00</vProd>
        </prod>
      </det>
      <det nItem="2">
        <prod>
          <cProd>PN002</cProd>
          <xProd>Pneu Michelin Primacy 4 205/55 R16</xProd>
          <NCM>40111000</NCM>
          <CFOP>5102</CFOP>
          <qCom>8</qCom>
          <vUnCom>380.00</vUnCom>
          <vProd>3040.00</vProd>
        </prod>
      </det>
      <det nItem="3">
        <prod>
          <cProd>PN-NEW-001</cProd>
          <xProd>Pneu Hankook Ventus V12 225/40 R18</xProd>
          <NCM>40111000</NCM>
          <CFOP>5102</CFOP>
          <qCom>6</qCom>
          <vUnCom>420.00</vUnCom>
          <vProd>2520.00</vProd>
        </prod>
      </det>
      <total>
        <ICMSTot>
          <vNF>8060.00</vNF>
        </ICMSTot>
      </total>
    </infNFe>
  </NFe>
</nfeProc>`;
