import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function convertSVGtoPNG() {
    const publicDir = join(__dirname, '..', 'public');

    try {
        // Converter icon-192.svg para PNG
        const svg192 = readFileSync(join(publicDir, 'icon-192.svg'));
        await sharp(svg192)
            .resize(192, 192)
            .png()
            .toFile(join(publicDir, 'icon-192.png'));
        console.log('✅ icon-192.png criado');

        // Converter icon-512.svg para PNG
        const svg512 = readFileSync(join(publicDir, 'icon-512.svg'));
        await sharp(svg512)
            .resize(512, 512)
            .png()
            .toFile(join(publicDir, 'icon-512.png'));
        console.log('✅ icon-512.png criado');

        // Criar apple-touch-icon
        await sharp(svg192)
            .resize(180, 180)
            .png()
            .toFile(join(publicDir, 'apple-touch-icon.png'));
        console.log('✅ apple-touch-icon.png criado');

        console.log('\n🎉 Todos os ícones PWA foram gerados com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao converter SVG para PNG:', error);
        process.exit(1);
    }
}

convertSVGtoPNG();
