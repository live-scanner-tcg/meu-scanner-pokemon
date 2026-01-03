export default async function handler(req, res) {
    const { set, num } = req.query;
    const apiKey = 'd18f5a1e-b4db-49ad-841b-6809c5f0515c'; // <--- COLOQUE SUA CHAVE AQUI

    // Se o usuário não mandar número, buscamos a coleção (set) inteira
    let url = `https://api.pokemontcg.io/v2/cards?q=set.id:${set}`;
    
    // Se mandar o número, buscamos a carta exata
    if (num) {
        url += ` number:${num}`;
    }

    try {
        const response = await fetch(url, {
            headers: { 'X-Api-Key': apiKey }
        });
        const data = await response.json();
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Erro na API' });
    }
}