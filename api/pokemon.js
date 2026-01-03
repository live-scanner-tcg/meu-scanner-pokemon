export default async function handler(req, res) {
    const { set } = req.query;
    const apiKey = 'd18f5a1e-b4db-49ad-841b-6809c5f0515c'; 

    if (!set) return res.status(400).json({ error: 'Set ausente' });

    try {
        // Mudamos a query: 'id:sv8a*' busca qualquer ID que comece com sv8a
        // Isso resolve o problema de IDs como 'sv8a-1', 'sv8a-045', etc.
        const url = `https://api.pokemontcg.io/v2/cards?q=id:${set}*&select=id,name,number,images&orderBy=number&pageSize=150`;

        const response = await fetch(url, {
            headers: { 'X-Api-Key': apiKey }
        });

        const data = await response.json();
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 's-maxage=3600'); 
        
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}