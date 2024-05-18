import prisma from '@/app/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';
import {unstable_noStore as noStore} from 'next/cache'

export async function GET() {
  noStore();
  const {getUser} = getKindeServerSession();
  const user = await getUser();

  if(!user || user === null || !user.id){
    throw new Error('Something went wrong, i am sorry....');
  }

  let dbuser = await prisma.user.findUnique({
    where: {
      id: user.id
    }
  });

  if(!dbuser){
    dbuser = await prisma.user.create({
      data: {
        email: user.email ?? '',
        firstName: user.given_name ?? '',
        lastName: user.family_name ?? '',
        id: user.id,
        profileImage: user.picture ?? `https://avatar.vercel.sh/${user.given_name}`
      }
    });
  }

  return NextResponse.redirect('https://airbnb-yt-bice-five.vercel.app');
}
