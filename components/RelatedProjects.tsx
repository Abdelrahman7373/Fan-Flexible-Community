import { UserProfile, ProjectInterface } from "@/common.types";
import { getUserPosts } from "@/lib/actions";
import Link from "next/link";
import Image from "next/image";

type Props = {
    userId: string;
    projectId: string;
};

const RelatedProjects = async ({userId,projectId}:Props) => {
    const result = await getUserPosts(userId) as {user?: UserProfile};
    const filteredPosts = result?.user?.projects?.edges?.filter(({node}: {node:ProjectInterface})=>node?.id !== projectId);

    if(filteredPosts?.length === 0)return <h1 className="mt-20">There is no more posts from this user</h1>

  return (
    <section className="flex flex-col mt-32 w-full">
        <div className="flexBetween">
            <p className="text-base font-bold">More Posts By {result?.user?.name}</p>
            <Link href={`/profile/${result?.user?.id}`} className="text-sky-400">
              View All
            </Link>
        </div>
        <div className="related_posts-grid">
          {filteredPosts?.map(({node}: {node:ProjectInterface})=>(
            <div className="flexCenter related_post-card drop-shadow-card">
              <Link href={`/post/${node?.id}`} className="flexCenter group relative w-full h-full">
                <Image src={node?.image} width={414} height={314} className="w-full h-full object-cover rounded-2xl" alt="Post Image" />
                <div className="hidden group-hover:flex related_post-card_title">
                  <p className="w-full">{node?.title}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
    </section>
  )
}

export default RelatedProjects
