import { UserProfile } from "@/common.types";
import ProfilePage from "@/components/ProfilePage";
import { getUserPosts } from "@/lib/actions";

type Props = {
    params: {
        id:string
    }
};

const Profile = async ({params}:Props) => {
    const result = await getUserPosts(params.id, 100) as {user: UserProfile};


    if(!result?.user){<p className="no-result-text">No Posts Found!</p>}

  return <ProfilePage user={result?.user}  />
}

export default Profile;
