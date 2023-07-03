import { ProjectInterface } from '@/common.types';
import Modal from '@/components/Modal';
import PostForm from '@/components/PostForm';
import { getProjectDetails } from '@/lib/actions';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

const EditPost = async({params:{id}}: {params:{id:string}}) => {
    const session = await getCurrentUser();
    if(!session?.user){redirect('/')};
    const result = await getProjectDetails(id) as {project?:ProjectInterface}

  return (
    <Modal>
      <h3 className='modal-head-text'>Edit Post</h3>
      <PostForm type="edit" session={session} post={result?.project} />
    </Modal>
  )
}

export default EditPost;
