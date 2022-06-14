import { lowermize } from "../../../lib/main";
import prisma from "../../../lib/prisma";
const bcrypt = require("bcrypt");

export default async function handle(req, res) {
  const model = lowermize(req.body.model);
  const body = req.body.data;

  console.log(body);

  let data = null;

    if (model === "user") {
      const newBody = body.map(item => ({...item, password: bcrypt.hashSync(body.item, 10)}))  
      data = await prisma[model].createMany({ data: newBody });
    } else {
      data = await prisma[model].createMany({ data: body });
    }

  res.json(data);
}
