'use client';

import { FormState, ProjectInterface, SessionInterface } from "@/common.types";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import FormField from "./FormField";
import { categoryFilters } from "@/constants";
import CustomMenu from "./CustomMenu";
import Button from "./Button";
import { createNewPost, fetchToken, updatePost } from "@/lib/actions";
import { useRouter } from "next/navigation";

type Props= {
    type: string;
    session: SessionInterface;
    post?: ProjectInterface;
};

const PostForm = ({type,session,post}:Props) => {
    const router = useRouter(); 

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
      setIsSubmitting(true);
      const {token} = await fetchToken();

      try {
        if(type==='create'){
          await createNewPost(form, session?.user?.id, token);
          router.push('/');
          window.location.reload();
        }
        if(type === 'edit'){
          await updatePost(form, post?.id as string, token)
          router.push('/');
          window.location.reload();
        }
      } catch (error) {
        console.log(error, 'Error creating new post');
      } finally {
        setIsSubmitting(false);
        window.location.reload();
      }
    };

    const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const file = e.target.files?.[0];
      if(!file) return;
      if(!file.type.includes('image')){return alert('Please Upload An Image');}

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        handleStateChange('image', result);
      };
    };

    const handleStateChange = (fieldName: string, value: string) => {
      setForm((prevState) => ({...prevState, [fieldName]:value}));
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState<FormState>({title: post?.title || "",description: post?.description || "",image: post?.image || "",liveSiteUrl: post?.liveSiteUrl || "",githubUrl: post?.githubUrl || "",category: post?.category || ""})

    const image = null;

  return (
    <form onSubmit={handleFormSubmit} className="flexStart form">
      <div className="flexStart form_image-container">
        <label htmlFor="poster" className="flexCenter form_image-label">
            {!form.image && 'Choose a thumbnail for your post!!'}
        </label>
        <input id="image" type="file" accept="image/*" required={type === 'create'} className="form_image-input" onChange={handleChangeImage} />
        {form.image &&(
            <Image src={form?.image} className="sm:p-10 object-contain z-20" alt="Thumbnail" fill />
        )}
      </div>
      <FormField title="Title" state={form.title} placeholder="Write The Title..." setState={(value) => handleStateChange('title', value)} />
      <FormField title="Description" state={form.description} placeholder="Write The Description..." setState={(value) => handleStateChange('description', value)} />
      <FormField type="url" title="Website URL" state={form.liveSiteUrl} placeholder="https://example.com" setState={(value) => handleStateChange('liveSiteUrl', value)} />
      <FormField type="url" title="GitHub(Source code OR Profile) Url" state={form.githubUrl} placeholder="https://github.com/user-example/project-example  OR  https://github.com/user-example" setState={(value) => handleStateChange('githubUrl', value)} />

      <CustomMenu title="Category" state={form.category} filters={categoryFilters} setState={(value) => handleStateChange('category', value)} />

      <div className="flexStart w-full">
        <Button title={isSubmitting? `${type==='create' ? 'Creating...':'Editing...'}`:`${type==='create'?'Create':'Edit'}`} type="submit" leftIcon={isSubmitting ? "" : '/plus.svg'} isSubmitting={isSubmitting} />
      </div>
    </form>
  )
}

export default PostForm
