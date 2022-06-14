import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
    const width = Number(req.body["width"]);
    const height = Number(req.body["height"]);
    const depth = Number(req.body["depth"]);
    const weight = Number(req.body["weight"]);
    const waermelast = Number(req.body["waermelast"]);
    const maxLeistungsaufnahme = Number(req.body["maxLeistungsaufnahme"]);
    const avgLeistungsaufnahme = Number(req.body["avgLeistungsaufnahme"]);
    const avgWasserverbrauch = Number(req.body["avgWasserverbrauch"]);
    const druckluft = Number(req.body["druckluft"]);
    const wasserqualitaet = Number(req.body["wasserqualitaet"]);
    const sound = Number(req.body["sound"]);
    const client = Number(req.body["analyzer"]["value"]);
    
  
    const analyzer = await prisma.analyzer.create({
        data: {
            name: req.body["name"],
            width: width,
            height: height,
            depth: depth,
            clientId: client,
            color: req.body["Color"],
            druckluft: druckluft,
            wasserqualitaet: wasserqualitaet,
            sound: sound,
            weight: weight,
            waermelast: waermelast,
            maxLeistungsaufnahme: maxLeistungsaufnahme,
            avgLeistungsaufnahme: avgLeistungsaufnahme,
            avgWasserverbrauch: avgWasserverbrauch

        }
    })

    res.json(analyzer);
}