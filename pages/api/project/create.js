import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
    
    console.log('here1')
    const analyzers = req.body["addedIds"]
    console.log(analyzers)
    const projectId = req.body['projectId']

    const countAnalyzers = await prisma.countAnalyzer.createMany({
            data: analyzers.map(c => 
            ({
                count: 1,
                projectId: Number(projectId),
                analyzerId: c
                
            })
            )
        })

    res.json(countAnalyzers);
}
