'use client';

import { deletePost, fetchToken } from '@/lib/actions';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const ProjectActions = ({projectId}:{projectId:string}) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeletePost = async () => {
        setIsDeleting(true);
        const hasConfirmed = confirm('Are you sure you want to delete this post!!!!');
        const {token} = await fetchToken();

        if(!hasConfirmed) {setIsDeleting(false);}

        if(hasConfirmed) {
          try {
              await deletePost(projectId, token);
              router.push('/');
              router.refresh();
          } catch (error) {
              console.log(error);
          } finally {
              setIsDeleting(false);
          }
        }
    };

  return (
    <>
      <Link href={`/edit-post/${projectId}`} className='flexCenter edit-action_btn'>
        <Image src='/pencil.svg' width={30} height={30} alt='edit' />
      </Link>

      <button type='button' className={`flexCenter delete-action_btn ${isDeleting ? 'bg-sky-100' : 'bg-sky-400'}`} onClick={handleDeletePost}>
        <Image src='/trash.svg' width={30} height={30} alt='delete' />
      </button>
    </>
  )
}

export default ProjectActions
