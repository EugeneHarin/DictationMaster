import { Metadata } from "next"
// import CustomersTable from "@/app/ui/customers/table"
// import { fetchFilteredCustomers } from "@/app/lib/data";

export const metadata: Metadata = {
  title: 'Customers',
}

export default async function Page() {
  return (
    <div>Customres Page</div>
  );
};


// export default async function Page({
//   searchParams
// }: {
//   searchParams?: {
//     query?: string,
//     page?: string,
//   };
// }) {
//   const query: string = searchParams?.query || '';
//   const customers = await fetchFilteredCustomers(query);

//   return <CustomersTable customers={customers} />;
// }
