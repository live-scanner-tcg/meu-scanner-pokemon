export default async function handler(req, res) {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Termo de busca vazio' });
    }

    // Se você tiver uma chave, coloque-a aqui. Se não, deixe vazio ''
    const apiKey = 'd18f5a1e-b4db-49ad-841b-6809c5f0515c'; 

    // Montamos a busca para ser o mais flexível possível
    const query = `name:"*${q}*" OR set.id:"${q}" OR id:"${q}*"`;
    const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}&pageSize=50`;

    try {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        // Só adiciona o cabeçalho se a chave existir
        if (apiKey) {
            options.headers['X-Api-Key'] = apiKey;
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erro da API Externa:", errorText);
            return res.status(response.status).json({ error: `API retornou erro ${response.status}` });
        }

        const data = await response.json();
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json(data);

    } catch (error) {
        console.error("Erro no Servidor Vercel:", error);
        return res.status(500).json({ error: 'Falha crítica na requisição' });
    }
}