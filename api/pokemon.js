// api/pokemon.js
export default async function handler(req, res) {
    const { set, num } = req.query;
    const apiKey = 'd18f5a1e-b4db-49ad-841b-6809c5f0515c'; 

    // O SEGREDO PARA JAPONESAS: 
    // Usamos uma query que foca no set.id e no número exato.
    // Exemplo de query: q=set.id:sv8a number:045
    let query = `set.id:${set}`;
    if (num) {
        query += ` number:${num}`;
    }

    const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}`;

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