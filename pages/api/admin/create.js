import prisma from "../../../lib/prisma";
const bcrypt = require("bcrypt");
import { lowermize } from "../../../lib/main";


export default async function handle(req, res) {
  const model = lowermize(req.body.model);
  const body = req.body.data;

  let data = null

  if (model === "user") {
    const newBody = {...body, password: bcrypt.hashSync(body.password, 10)} 
    data = await prisma[model].create({ data: newBody });
  } else {
    data = await prisma[model].create({ data: body });
  }

  

  res.json(data);
}