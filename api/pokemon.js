export default async function handler(req, res) {
    // Pegamos o que o usuário digitou no input
    const { set } = req.query;
    
    // IMPORTANTE: Substitua pelo seu token real entre as aspas
    const apiKey = 'd18f5a1e-b4db-49ad-841b-6809c5f0515c'; 

    // Se o usuário não digitou nada, evitamos o erro 500 retornando vazio
    if (!set) {
        return res.status(400).json({ error: 'O parâmetro SET é obrigatório' });
    }

    try {
        // Criamos a URL de busca otimizada para o banco japonês
        const url = `https://api.pokemontcg.io/v2/cards?q=set.id:${set}*&select=id,name,number,images&orderBy=number&pageSize=100`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Api-Key': apiKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        // Se a API oficial responder com erro (ex: 429 por muitas requisições)
        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: 'Erro na API Oficial', details: errorText });
        }

        const data = await response.json();
        
        // Configurações de Cache e Permissões (CORS)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
        
        return res.status(200).json(data);

    } catch (error) {
        console.error("Erro interno:", error);
        return res.status(500).json({ error: 'Falha crítica no servidor', message: error.message });
    }
}