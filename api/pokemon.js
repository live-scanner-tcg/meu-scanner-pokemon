export default async function handler(req, res) {
    const { set } = req.query;
    const apiKey = 'd18f5a1e-b4db-49ad-841b-6809c5f0515c'; 

    if (!set) return res.status(400).json({ error: 'Set ausente' });

    try {
        // Conforme a documentação: q=set.id:sv8a
        // Usamos backticks para garantir que a query vá limpa
        const query = `set.id:${set}`;
        const url = `https://api.pokemontcg.io/v2/cards?q=${query}&select=id,name,number,images&orderBy=number&pageSize=250`;

        const response = await fetch(url, {
            headers: { 
                'X-Api-Key': apiKey,
                'Accept': 'application/json'
            }
        });

        const result = await response.json();
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 's-maxage=86400'); 
        
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
}