import dbConnect from "@/lib/db";

export default async function Home() {
  dbConnect();
  return <div className="">Hello, I am</div>;
}
