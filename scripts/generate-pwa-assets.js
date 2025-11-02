const fs = require('fs');
const path = require('path');

// Cores do tema AvilaOps
const PRIMARY = '#10B981'; // Verde matrix
const DARK = '#0B0F17';    // Background escuro

// Criar SVG para os ícones
function generateIconSVG(size) {
    return `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${PRIMARY};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#047857;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="${DARK}"/>
  
  <!-- Terminal bracket -->
  <text 
    x="50%" 
    y="50%" 
    dominant-baseline="middle" 
    text-anchor="middle" 
    font-family="monospace" 
    font-size="${size * 0.6}" 
    font-weight="bold" 
    fill="url(#grad)"
  >[A]</text>
  
  <!-- Terminal cursor -->
  <rect 
    x="${size * 0.68}" 
    y="${size * 0.35}" 
    width="${size * 0.08}" 
    height="${size * 0.3}" 
    fill="${PRIMARY}"
    opacity="0.8"
  />
</svg>
`.trim();
}

// Criar manifesto PWA
const manifest = {
    name: "AvilaOps - Infrastructure That Scales",
    short_name: "AvilaOps",
    description: "Transformamos infraestrutura legacy em arquiteturas cloud-native escaláveis.",
    start_url: "/",
    display: "standalone",
    background_color: DARK,
    theme_color: PRIMARY,
    orientation: "portrait-primary",
    icons: [
        {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
        },
        {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
        },
        {
            src: "/favicon.svg",
            sizes: "any",
            type: "image/svg+xml"
        }
    ],
    categories: ["business", "productivity", "utilities"],
    shortcuts: [
        {
            name: "Terminal",
            short_name: "Terminal",
            description: "Acesso rápido ao terminal interativo",
            url: "/#terminal",
            icons: [{ src: "/icon-192.png", sizes: "192x192" }]
        },
        {
            name: "Serviços",
            short_name: "Serviços",
            description: "Ver serviços disponíveis",
            url: "/#servicos",
            icons: [{ src: "/icon-192.png", sizes: "192x192" }]
        }
    ]
};

// Salvar arquivos
const publicDir = path.join(__dirname, '..', 'public');

// Salvar SVGs
fs.writeFileSync(
    path.join(publicDir, 'icon-192.svg'),
    generateIconSVG(192)
);

fs.writeFileSync(
    path.join(publicDir, 'icon-512.svg'),
    generateIconSVG(512)
);

// Salvar manifest.json
fs.writeFileSync(
    path.join(publicDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
);

console.log('✅ PWA assets gerados com sucesso!');
console.log('📁 Arquivos criados:');
console.log('   - public/icon-192.svg');
console.log('   - public/icon-512.svg');
console.log('   - public/manifest.json');
console.log('\n⚠️  Para gerar PNGs, use um conversor SVG→PNG ou ferramentas como:');
console.log('   - https://www.npmjs.com/package/sharp');
console.log('   - https://cloudconvert.com/svg-to-png');
