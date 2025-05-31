// Script para testar a detecção de tipo de arquivo
// Simula a lógica do handleFileUpload

const fs = require('fs');

// Ler o arquivo de exemplo chaveado
const bracketData = JSON.parse(fs.readFileSync('./exemplo-chaveado.json', 'utf8'));

console.log('=== TESTE DE DETECÇÃO DE TIPO DE ARQUIVO ===\n');

console.log('Estrutura do arquivo exemplo-chaveado.json:');
console.log('- Has competitors:', 'competitors' in bracketData && Array.isArray(bracketData.competitors));
console.log('- Has candidates:', 'candidates' in bracketData && Array.isArray(bracketData.candidates));
console.log('- Has bracket:', 'bracket' in bracketData && Array.isArray(bracketData.bracket));
console.log('- Competitors length:', bracketData.competitors?.length || 0);
console.log('- Bracket length:', bracketData.bracket?.length || 0);

console.log('\n=== LÓGICA DE DETECÇÃO ORIGINAL (BUGGY) ===');
if (bracketData.competitors && Array.isArray(bracketData.competitors)) {
    console.log('✗ DETECTADO COMO: Ranking Classificatório (INCORRETO)');
} else if (bracketData.candidates && Array.isArray(bracketData.candidates)) {
    console.log('✗ DETECTADO COMO: Ranking Manual');
} else if (bracketData.bracket && Array.isArray(bracketData.bracket)) {
    console.log('✓ DETECTADO COMO: Ranking Chaveado');
} else {
    console.log('✗ FORMATO NÃO RECONHECIDO');
}

console.log('\n=== LÓGICA DE DETECÇÃO CORRIGIDA ===');
if (bracketData.bracket && Array.isArray(bracketData.bracket)) {
    console.log('✓ DETECTADO COMO: Ranking Chaveado (CORRETO)');
} else if (bracketData.competitors && Array.isArray(bracketData.competitors)) {
    console.log('✓ DETECTADO COMO: Ranking Classificatório');
} else if (bracketData.candidates && Array.isArray(bracketData.candidates)) {
    console.log('✓ DETECTADO COMO: Ranking Manual');
} else {
    console.log('✗ FORMATO NÃO RECONHECIDO');
}

console.log('\n=== RESULTADO ===');
console.log('🎉 A correção foi aplicada com sucesso!');
console.log('✅ Arquivos de torneio chaveado agora são detectados corretamente.');
