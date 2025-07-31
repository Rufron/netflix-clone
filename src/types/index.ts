import { AxiosRequestConfig, AxiosResponse } from "axios";
import { Icon } from "next/dist/lib/metadata/types/metadata-types";
import { IconType } from "react-icons";



export interface SliderButtonProps {
    isRight?: boolean;
}

export interface ButtonProps {
    filled?: boolean;
    label?: string;
    Icon: IconType;
    rounded?: boolean;
    onClick?: () => void;
    hidden?: boolean;
}

export interface CardProps {
    defaultCard?:boolean;
    removeMovie?: (id: number) => void;
    item: Media;
    MediaType?: string;
    enableGenres?: boolean;
    
}

export enum MediaType{
    Movie = "movie",
    TV = "tv",
    
}

export interface Genre {
    id: number; 
    name: string;
}

export interface Media {
    id: number;
    adult: boolean;
    genre_ids: number[];
    original_language: string;
    original_title: string;
    popularity: number;
    title: string;
    video: boolean;
    vote_count: number;
    key?: string;
    genre?: string;
    overview: string;
    release_date: string;
    type?: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
}

export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
}

export interface MediaItem {
    id: number;
    // type: "movie" | "tv";
    title: string;
    type: MediaType; 
    genres?: Genre[]; 
    genre_ids?: number[]; 
    vote_average: number;
    poster_path?: string;
    backdrop_path?: string;
}

export interface AxiosErrorType {
    code?: string;
    message: string;
    response?: AxiosResponse;
    config?: AxiosRequestConfig;
    name: string;
    status?: number;
    stack?: string;
    request? : XMLHttpRequest
}

export interface RequestError extends Error {
    status?: number;
    details?: unknown;
}

export interface ApiResponse<T> {
    data?: T;
    error?: RequestError | undefined;
}

export interface MovieResponse {
    page: number;
    total_results: number;
    total_pages: number;
    genres?: [];
    results: Media[];
}

export interface RenderGenreProps {
    genreIds: number[];
}

export interface ChildrenProvider {
 children: React.ReactNode;
}

export interface ModalProps {
    modalData: Media | null;
    modalOpen: boolean;
    enableGenres: boolean
    handleClose: () => void;
}

export interface SimilarMediaProps {
    id: number;
}