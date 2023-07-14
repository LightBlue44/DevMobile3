import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { EnsureAuthenticateUser } from "../middlewares/EnsureAuthenticateUser";

const prisma = new PrismaClient();

const userRoute = Router();

interface IRequest {
  name: string;
  email: string;
  senha?: string;
}

//busca todos os usuários
userRoute.get("/getall", EnsureAuthenticateUser, async (req, res) => {
  const getAll = await prisma.user.findMany();

  res.json(getAll);
});

//busca um usuário por id
userRoute.get("/:id", EnsureAuthenticateUser, async (req, res) => {
  const { id } = req.params;

  const getById = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  res.json(getById);
});

//busca um usuário por email ou nome
userRoute.get("/getone/:name", EnsureAuthenticateUser, async (req, res) => {
  const { name, email } = req.query;

  const getSearch = await prisma.user.findFirst({
    where: {
      OR: [
        {
          name: {
            contains: String(name),
          },
        },
        {
          email: {
            contains: String(email),
          },
        },
      ],
    },
  });

  res.json(getSearch);
});

interface IRequest {
  name: string;
  email: string;
}

//cria um usuário
userRoute.post("/", async (req, res) => {
  const { name, email }: IRequest = req.body;

  const userExist = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (userExist)
    return res.status(404).json({ error: true, message: "Usuário já existe" });

  const createUser = await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  res.json(createUser);
});

//atualiza um usuário
userRoute.put("/:id", async (req, res) => {
  const { name, email }: IRequest = req.body;
  const { id } = req.params;

  const userExist = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (!userExist)
    return res.status(400).json({ error: true, message: "Usuário não existe" });

  const updateUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
      email,
    },
    select: {
      name: true,
      email: true,
      post: true,
    },
  });

  res.json(updateUser);
});

//deleta um usuário
userRoute.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const userExist = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (!userExist)
    return res.status(400).json({ error: true, message: "Usuário não existe" });

  const deleteUser = await prisma.user.delete({
    where: {
      id,
    },
  });

  res.json(deleteUser);
});
