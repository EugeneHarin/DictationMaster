'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { getCurrentUserRole } from "@/app/lib/user-actions";
import { useEffect, useState } from "react";
import { User } from "@/app/lib/definitions";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
type LinksList = {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref">>;
  roles: User['role'][];
}

const links: LinksList[] = [
  // {
  //   name: 'Dashboard',
  //   href: '/dashboard',
  //   icon: HomeIcon,
  //   roles: ['teacher'],
  // },
  {
    name: 'Dictations',
    href: '/dashboard/dictations',
    icon: DocumentDuplicateIcon,
    roles: ['teacher', 'student'],
  },
  // {
  //   name: 'Students',
  //   href: '/dashboard/students',
  //   icon: UserGroupIcon,
  //   roles: ['teacher'],
  // },
  {
    name: 'Results',
    href: '/dashboard/results',
    icon: AcademicCapIcon,
    roles: ['teacher', 'student'],
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<User['role']>();

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getCurrentUserRole();
      setUserRole(role);
    };

    fetchUserRole();
  }, []);

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          ((
              link.roles.includes('teacher') && link.roles.includes('student')
            ) || (
              userRole && link.roles.includes(userRole)
            )
          ) && (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3  transition-all',
                {
                  'bg-sky-100 text-blue-600': pathname === link.href,
                },
              )}
              prefetch={false}
              draggable="false"
            >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
            </Link>
          )
        );
      })}
    </>
  );
}
