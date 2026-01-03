// api/get-pokemon.js
export default async function handler(req, res) {
    const { id } = req.query; // Pega o ID da URL (ex: xy1-1)
    const apiKey = 'd18f5a1e-b4db-49ad-841b-6809c5f0515c'; // Coloque sua chave real aqui

    try {
        const response = await fetch(`https://api.pokemontcg.io/v2/cards/${id}`, {
            method: 'GET',
            headers: {
                'X-Api-Key': apiKey,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        // Isso libera o acesso para o seu HTML ler os dados sem erro de CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao acessar a API do Pokémon' });
    }
}
