import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { voterValidationSchema } from 'validationSchema/voters';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.voter
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getVoterById();
    case 'PUT':
      return updateVoterById();
    case 'DELETE':
      return deleteVoterById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getVoterById() {
    const data = await prisma.voter.findFirst(convertQueryToPrismaUtil(req.query, 'voter'));
    return res.status(200).json(data);
  }

  async function updateVoterById() {
    await voterValidationSchema.validate(req.body);
    const data = await prisma.voter.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteVoterById() {
    const data = await prisma.voter.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
