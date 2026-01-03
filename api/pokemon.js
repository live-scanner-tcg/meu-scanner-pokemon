export default async function handler(req, res) {
    const { q } = req.query; // Mudamos para 'q' de query geral
    const apiKey = 'd18f5a1e-b4db-49ad-841b-6809c5f0515c'; 

    if (!q) return res.status(400).json({ error: 'Digite algo para buscar' });

    // Buscamos pelo NOME do set. Isso é muito mais fácil de acertar que o ID.
    // Exemplo: q=set.name:"151"
    const url = `https://api.pokemontcg.io/v2/cards?q=set.name:"${q}*"&pageSize=100&select=id,name,number,images,set`;

    try {
        const response = await fetch(url, {
            headers: { 'X-Api-Key': apiKey }
        });
        const data = await response.json();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro de conexão' });
    }
}