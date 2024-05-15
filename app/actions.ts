'use server';

import { redirect } from 'next/navigation';
import prisma from './lib/db';
import { supabase } from './lib/supabase';

export async function createAirbnbHome({ userId }: { userId: string }) {
  const data = await prisma.home.findFirst({
    where: {
      userId: userId,
    },
    orderBy: {
      createAt: 'desc',
    },
  });

  if (data === null) {
    const data = await prisma.home.create({
      data: {
        userId: userId,
      },
    });

    return redirect(`/create/${data.id}/structure`);
  } else if (
    !data.addedCategory &&
    !data.addedDescription &&
    !data.addedLocation
  ) {
    return redirect(`/create/${data.id}/structure`);
  } else if (data.addedCategory && !data.addedDescription) {
    return redirect(`/create/${data.id}/description`);
  } else if (
    data.addedCategory &&
    data.addedDescription &&
    !data.addedLocation
  ) {
    return redirect(`/create/${data.id}/address`);
  } else if (
    data.addedCategory &&
    data.addedDescription &&
    data.addedLocation
  ) {
    const data = await prisma.home.create({
      data: {
        userId: userId,
      },
    });
    return redirect(`/create/${data.id}/structure`);
  }
}

export async function createCategoryPage(formdData: FormData) {
  const categoryName = formdData.get('categoryName') as string;
  const homeId = formdData.get('homeId') as string;
  const data = await prisma.home.update({
    where: {
      id: homeId,
    },
    data: {
      categoryName: categoryName,
      addedCategory: true,
    },
  });

  return redirect(`/create/${homeId}/description`);
}

export async function CreateDescription(formData: FormData) {
  const {
    title,
    description,
    price,
    image: imageFile,
    guest: guestNumber,
    room: roomNumber,
    bathroom: bathroomNumber,
    homeId,
  } = Object.fromEntries(formData.entries()) as {
    title: string;
    description: string;
    price: string;
    image: File;
    guest: string;
    room: string;
    bathroom: string;
    homeId: string;
  };

  const { data: imageData } = await supabase.storage
    .from('images')
    .upload(`${imageFile.name}-${new Date()}`, imageFile, {
      cacheControl: '2592000',
      contentType: 'image/png',
    });

  const data = await prisma.home.update({
    where: {
      id: homeId,
    },
    data: {
      title: title,
      description: description,
      price: Number(price),
      bathrooms: roomNumber,
      bedrooms: bathroomNumber,
      guests: guestNumber,
      photo: imageData?.path,
      addedDescription: true,
    },
  });

  return redirect(`/create/${homeId}/address`);
}

export async function createAddressPage(formData: FormData) {
  const homdeId = formData.get('homeId') as string;
  const countryVlaue = formData.get('countryValue') as string;
  const data = await prisma.home.update({
    where: {
      id: homdeId,
    },
    data: {
      country: countryVlaue,
      addedLocation: true,
    },
  });

  return redirect('/');
}
