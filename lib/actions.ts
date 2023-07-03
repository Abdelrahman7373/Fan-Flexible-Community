import { GraphQLClient } from "graphql-request";
import {createProjectMutation, createUserMutation, deletePostMutation, getPostsOfUserQuery, getProjectByIdQuery, getUserQuery, projectsQuery, updatePostMutation} from '@/graphql';
import { ProjectForm } from "@/common.types";

const isProduction = process.env.NODE_ENV === "production";
const apiUrl = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || '' : 'http://127.0.0.1:4000/graphql';
const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || '' : 'signmein';
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000';
const client = new GraphQLClient(apiUrl);



const makeGraphQLRequest = async (query: string, variables={}) => {
    try {
        return await client.request(query, variables)
    } catch (error) {
        throw error;
    }
};

export const getUser = (email: string) => {
    client.setHeader('x-api-key', apiKey);
    return makeGraphQLRequest(getUserQuery, {email});
};

export const createUser = (name: string, email: string, avatarUrl: string) => {
    client.setHeader('x-api-key', apiKey);
    const variables={
        input:{
            name, email, avatarUrl
        }
    }
    return makeGraphQLRequest(createUserMutation, variables);
};

export const fetchToken = async () => {
    try {
        const response = await fetch(`${serverUrl}/api/auth/token`);
        return response.json();
    } catch (error) {
        throw error;
    }
};


export const uploadImage = async (imagePath: string)=> {
    try {
        const response = await fetch(`${serverUrl}/api/upload`, {
            method: 'POST', body: JSON.stringify({path: imagePath})
        });

        return response.json();
    } catch (error) {
        throw error;
    }
}

export const createNewPost = async (form: ProjectForm, creatorId: string, token: string)=>{
    const imageUrl = await uploadImage(form.image);

    if(imageUrl.url){
        client.setHeader("Authorization", `Bearer ${token}`);

        const variables = {input:{...form, image: imageUrl.url, createdBy:{link:creatorId}}}

        return makeGraphQLRequest(createProjectMutation, variables)
    }
};

export const fetchAllPosts = async (category?: string,endCursor?: string) => {
    client.setHeader('x-api-key', apiKey);

    return makeGraphQLRequest(projectsQuery, {category,endCursor});
};

export const getProjectDetails = (id:string) => {
    client.setHeader('x-api-key', apiKey);
    return makeGraphQLRequest(getProjectByIdQuery, {id});
};

export const getUserPosts = (id:string, last?: number) => {
    client.setHeader('x-api-key', apiKey);
    return makeGraphQLRequest(getPostsOfUserQuery, {id,last});
};

export const deletePost = (id:string, token: string) => {
    client.setHeader("Authorization", `Bearer ${token}`);
    return makeGraphQLRequest(deletePostMutation, {id});
};

export const updatePost = async (form:ProjectForm, postId: string, token: string) => {
    function isBase64DataUrl(value:string) {
        const base64Regex = /^data:image\/[a-z]+;base64,/;
        return base64Regex.test(value);
    };

    let updatedForm = {...form};
    const isUploadingNewThumbnail = isBase64DataUrl(form.image);
    if(isUploadingNewThumbnail){
        const imageUrl = await uploadImage(form.image);
        if(imageUrl.url){
            updatedForm={...form, image:imageUrl.url}
        }
    }


    const variables = {id:postId, input: updatedForm}

    client.setHeader("Authorization", `Bearer ${token}`);
    return makeGraphQLRequest(updatePostMutation, variables);
};
