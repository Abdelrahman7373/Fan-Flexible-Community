import { ProjectInterface } from '@/common.types';
import Categories from '@/components/Categories';
import LoadMore from '@/components/LoadMore';
import PostCard from '@/components/PostCard';
import { fetchAllPosts } from '@/lib/actions';

type PostsSearch = {
  projectSearch:{edges:{node:ProjectInterface}[]; pageInfo:{hasPreviousPage:boolean;hasNextPage:boolean;startCursor:string;endCursor:string}}
};

type SearchParams = {category?:string; endcursor?:string};
type Props = {searchParams:SearchParams;};

const Home = async ({searchParams:{category, endcursor}}:Props) => {
    const data = await fetchAllPosts(category,endcursor) as PostsSearch;
    
    const postsToDisplay = data?.projectSearch?.edges || [];
  
  if(postsToDisplay.length === 0) {
    return(
      <section className='flexStart flex-col paddings'>
        <Categories />
        <p className='no-result-text text-center'>No Posts Found, Go Create Some Posts!</p>
      </section>
    );
  }

  const pagination = data?.projectSearch?.pageInfo;

  return (
    <section className='flexStart flex-col padding mb-16'>
      <input type="text" placeholder="Search Functionality Is Comming Soon..." required className="search_input peer" />
      <Categories />
      <section className='posts-grid'>
        {postsToDisplay.map(({node}:{node:ProjectInterface})=>(
          <PostCard key={node?.id} id={node?.id} image={node?.image} title={node?.title} name={node?.createdBy?.name} avatarUrl={node?.createdBy?.avatarUrl} userId={node?.createdBy?.id} />
        ))}
      </section>
      <LoadMore startCursor={pagination.startCursor} endCursor={pagination.endCursor} hasNextPage={pagination.hasNextPage} hasPreviousPage={pagination.hasPreviousPage} />
    </section>
  )
}

export default Home;
