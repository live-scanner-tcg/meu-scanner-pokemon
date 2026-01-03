// api/pokemon.js
export default async function handler(req, res) {
    const { set, num } = req.query;
    const apiKey = 'd18f5a1e-b4db-49ad-841b-6809c5f0515c'; 

    let query = `set.id:${set}`;
    if (num) { query += ` number:${num}`; }

    // O SEGREDO DA VELOCIDADE: Selecionamos apenas o essencial para a galeria
    const fields = 'id,name,number,images';
    const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}&select=${fields}&orderBy=number`;

    try {
        const response = await fetch(url, {
            headers: { 'X-Api-Key': apiKey }
        });
        const data = await response.json();
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 's-maxage=86400'); // Cache de 24h na Vercel para ser instantâneo na próxima vez
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Erro na API' });
    }
}