import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
    const ids = req.body['deletedIds'];
    const projectId = req.body['projectId']
    
  
    const analyzer = await prisma.countAnalyzer.deleteMany({
        where: {
            projectId: Number(projectId),
            analyzerId: {
                in: ids
            }
        }
    })

    res.json(analyzer);
}