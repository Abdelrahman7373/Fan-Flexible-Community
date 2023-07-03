import Modal from '@/components/Modal';
import PostForm from '@/components/PostForm';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

const CreatePost = async() => {
    const session = await getCurrentUser();
    if(!session?.user){redirect('/')};

  return (
    <Modal>
      <h3 className='modal-head-text'>Create A New Post</h3>
      <PostForm type="create" session={session} />
    </Modal>
  )
}

export default CreatePost;
