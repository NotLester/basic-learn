import Link from "next/link";

import { CreatePost } from "@/components/create-post";
import { DeletePostBtn } from "@/components/delete-post-btn";
import { RemoveLatestPostBtn } from "@/components/remove-latest-post-btn";
import { api } from "@/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="https://create.t3.gg/en/usage/first-steps"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">First Steps →</h3>
            <div className="text-lg">
              Just the basics - Everything you need to know to set up your
              database and authentication.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="https://create.t3.gg/en/introduction"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Documentation →</h3>
            <div className="text-lg">
              Learn more about Create T3 App, the libraries it uses, and how to
              deploy it.
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>
        </div>

        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-5">
      <AllPosts />
      <LatestPostList />
      <CreatePost />
      <RemoveLatestPostBtn />
    </div>
  );
}

async function AllPosts() {
  const allPosts = await api.post.getAllPosts();

  if (allPosts.length == 0) return <p>There are no posts...</p>;

  return (
    <div className="border-3 border-solid p-2 shadow-inner">
      <h1 className="text-center text-2xl font-semibold">All Posts</h1>
      <ul className="flex flex-col gap-5">
        {allPosts.map((post) => (
          <div key={post.id} className="flex gap-28">
            <li>{post.name}</li>
            <DeletePostBtn id={post.id} />
          </div>
        ))}
      </ul>
    </div>
  );
}

async function LatestPostList() {
  const latestPost = await api.post.getLatest();

  if (!latestPost) return <p>You have no posts yet to get latest Post.</p>;
  return <p className="truncate">Your most recent post: {latestPost.name}</p>;
}
