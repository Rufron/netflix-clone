import { MediaItem } from '@/types';
import { useEffect } from 'react';

const handleAddToLocalStorage = (item: MediaItem) => {
    const existingItems: MediaItem[] = JSON.parse( 
    localStorage.getItem("favouriteItems") , []
    )

    const IsAlreadyInList = existingItems.some(
        (existingItems) => {
            existingItems.id == item.id && existingItems.type == item.type;
        }  
    )

    if (!IsAlreadyInList) {
        existingItems.push(item);
        localStorage.setItem("favouriteItems", JSON.stringify(existingItems));
    }
}

const handleRemoveFromLocalStorage = (item: MediaItem) => {
    const existingItems: MediaItem[] = JSON.parse(
        localStorage.getItem("favouriteItems") || "[]"
    );

    const updatedItems = existingItems.filter(
        (existingItem) => { 
           return existingItem.id !== item.id || existingItem.type !== item.type
        }
    );

    localStorage.setItem("favouriteItems", JSON.stringify(updatedItems));
};

const isItemInLocalStorage = (id: number, type: string): boolean => {
    const existingItems: MediaItem[] = JSON.parse(
        localStorage.getItem("favouriteItems") || "[]"
    );

    return existingItems.some(
        (existingItem) => existingItem.id === id && existingItem.type === type
    );
}

export default handleAddToLocalStorage;
export { handleRemoveFromLocalStorage, isItemInLocalStorage };