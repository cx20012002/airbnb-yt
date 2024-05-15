import Image from 'next/image';
import { useContries } from '../lib/getCountries';
import Link from 'next/link';

interface iAppProps {
  imagePath: string;
  description: string;
  location: string;
  price: number;
}

export function ListingCard({
  imagePath,
  description,
  location,
  price,
}: iAppProps) {
  const { getCountryByValue } = useContries();
  const country = getCountryByValue(location);

  return (
    <div className="flex flex-col">
      <div className="relative h-72">
        <Image
          src={`https://rtdotytthdffkjuvtonh.supabase.co/storage/v1/object/public/images/${imagePath}`}
          alt="Image of House"
          fill
          className="rounded-lg h-full object-cover mb-3"
        />
      </div>

      <Link href={'/'} className="mt-2">
        <h3 className="font-medium text-base">
          {country?.flag} {country?.label} / {country?.region}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {description}
        </p>
        <p className="pt-2 text-muted-foreground">
          <span className="font-medium text-black">${price}</span> Night
        </p>
      </Link>
    </div>
  );
}
