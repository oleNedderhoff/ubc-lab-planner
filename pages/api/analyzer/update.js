import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
    console.log("req body: ", req.body)
    const id = Number(req.body["id"]);
    const width = Number(req.body["width"]);
    const height = Number(req.body["height"]);
    const depth = Number(req.body["depth"]);
    
  
    const analyzer = await prisma.analyzer.update({
        where: {
            id: id,
        },
        data: {
            name: req.body["name"],
            width: width,
            height: height,
            depth: depth,
            color: req.body["color"]
        }
    })

    res.json(analyzer);
}