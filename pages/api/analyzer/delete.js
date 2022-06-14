import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const data = req.body

  await prisma.countAnalyzer.deleteMany({
    where:{
      analyzerId: data['id']
    }
  })

  await prisma.analyzer.delete({
    where: data
  })



  res.json();
}