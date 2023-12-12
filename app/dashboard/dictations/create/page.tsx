import Form from '@/app/ui/dictations/create-form';
import Breadcrumbs from '@/app/ui/dictations/breadcrumbs';
import { fetchTeachers } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Invoice',
};

export default async function Page() {
  return(
    <div>Create Dictation</div>
  );
};


// export default async function Page() {
//   const teachers = await fetchTeachers();

//   return (
//     <main>
//       <Breadcrumbs
//         breadcrumbs={[
//           { label: 'Dictation', href: '/dashboard/dictations' },
//           {
//             label: 'Create Invoice',
//             href: '/dashboard/dictations/create',
//             active: true,
//           },
//         ]}
//       />
//       <Form customers={teachers} />
//     </main>
//   );
// }
