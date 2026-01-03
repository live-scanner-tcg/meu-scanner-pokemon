export default async function handler(req, res) {
    const { q } = req.query;
    const apiKey = 'd18f5a1e-b4db-49ad-841b-6809c5f0515c'; 

    if (!q) return res.status(400).json({ error: 'Termo vazio' });

    // Tentativa 1: Busca exata pelo ID do set (ex: sv8a)
    // Tentativa 2: Busca por cartas que COMECEM com esse ID (ex: sv8a-001)
    // Tentativa 3: Busca pelo nome do set (ex: Terastal Festival)
    const query = `(set.id:"${q}" OR id:${q}* OR set.name:"*${q}*")`;
    const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}&pageSize=100&select=id,name,number,images,set`;

    try {
        const response = await fetch(url, {
            headers: { 'X-Api-Key': apiKey }
        });
        const data = await response.json();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Erro na API' });
    }
}