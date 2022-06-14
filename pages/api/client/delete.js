import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const data = req.body
  console.log(data)

  await prisma.analyzer.deleteMany({
    where:{
      clientId: data['id']
    }
  })

  await prisma.client.delete({
    where: data
  })

  res.json();
}
