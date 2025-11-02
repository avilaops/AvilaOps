/**
 * Script para converter SVGs em PNGs
 * Instalar dependências: npm install sharp --save-dev
 * Executar: node scripts/generate-images.js
 */

import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');

async function convertSvgToPng(svgPath, pngPath, width, height) {
  try {
    await sharp(svgPath)
      .resize(width, height)
      .png()
      .toFile(pngPath);
    console.log(`✓ Gerado: ${path.basename(pngPath)} (${width}x${height})`);
  } catch (error) {
    console.error(`✗ Erro ao gerar ${path.basename(pngPath)}:`, error.message);
  }
}

async function generateImages() {
  console.log('🎨 Gerando imagens PNG a partir dos SVGs...\n');

  // Verificar se sharp está instalado
  try {
    await import('sharp');
  } catch (error) {
    console.error('⚠️  Sharp não instalado. Execute: npm install sharp --save-dev');
    console.error('   Erro:', error.message);
    process.exit(1);
  }

  // Open Graph Image (1200x630)
  await convertSvgToPng(
    path.join(publicDir, 'og-image.svg'),
    path.join(publicDir, 'og-image.png'),
    1200,
    630
  );

  // PWA Icons
  await convertSvgToPng(
    path.join(publicDir, 'icon.svg'),
    path.join(publicDir, 'icon-192.png'),
    192,
    192
  );

  await convertSvgToPng(
    path.join(publicDir, 'icon.svg'),
    path.join(publicDir, 'icon-512.png'),
    512,
    512
  );

  // Favicon ICO (gerar 32x32 primeiro, depois converter)
  const faviconPngPath = path.join(publicDir, 'favicon-32.png');
  await convertSvgToPng(
    path.join(publicDir, 'favicon.svg'),
    faviconPngPath,
    32,
    32
  );

  // Logo em alta resolução
  await convertSvgToPng(
    path.join(publicDir, 'logo.svg'),
    path.join(publicDir, 'logo.png'),
    400,
    400
  );

  console.log('\n✅ Todas as imagens foram geradas com sucesso!');
  console.log('\n📋 Próximos passos:');
  console.log('   1. Converter favicon-32.png para .ico usando ferramenta online:');
  console.log('      https://convertio.co/png-ico/');
  console.log('   2. Ou usar ImageMagick: convert favicon-32.png -define icon:auto-resize=32,16 favicon.ico');
  console.log('   3. Revisar as imagens geradas na pasta /public');
}

// Executar
await generateImages();
