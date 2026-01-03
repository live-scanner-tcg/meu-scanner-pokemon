export default async function handler(req, res) {
    // Pegamos o parâmetro 'q' que virá do HTML
    const { q } = req.query;
    const apiKey = 'd18f5a1e-b4db-49ad-841b-6809c5f0515c'; 

    if (!q) {
        return res.status(400).json({ error: 'Termo de busca vazio' });
    }

    // Buscamos em vários campos ao mesmo tempo para não dar erro
    // Isso procura o termo no ID do set OU no nome do set
    const query = `(set.id:${q}* OR set.name:${q}*)`;
    const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}&pageSize=100&select=id,name,number,images,set`;

    try {
        const response = await fetch(url, {
            headers: { 'X-Api-Key': apiKey }
        });
        
        const data = await response.json();
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        
        // Retorna os dados para o navegador
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Erro interno na API' });
    }
}