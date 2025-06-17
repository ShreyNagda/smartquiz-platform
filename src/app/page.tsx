import dbConnect from "@/lib/db";

export default async function Home() {
  dbConnect();
  // const session = await auth();
  // if (session) {
  //   redirect("/dashboard");
  // }
  return <div className="w-full">Hello, I am</div>;
}
