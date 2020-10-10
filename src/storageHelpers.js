import { storagePath } from "./config";
import { firebaseConfig } from "./firebaseConfig";

export const getSpecialistImage = (image) => {
  return `https://firebasestorage.googleapis.com/v0/b/${
    firebaseConfig.storageBucket
  }/o/${encodeURIComponent(storagePath)}specialist_images%2F${image}?alt=media`;
};
export const getOwnerImage = (image) => {
  return `https://firebasestorage.googleapis.com/v0/b/${
    firebaseConfig.storageBucket
  }/o/${encodeURIComponent(storagePath)}owner_images%2F${image}?alt=media`;
};
export const getNewsImage = (image) => {
  return `https://firebasestorage.googleapis.com/v0/b/${
    firebaseConfig.storageBucket
  }/o/${encodeURIComponent(storagePath)}news_images%2F${image}?alt=media`;
};
export const getGalleryThumdbImage = (image) => {
  return `https://firebasestorage.googleapis.com/v0/b/${
    firebaseConfig.storageBucket
  }/o/${encodeURIComponent(storagePath)}gallery_images%2F${image}?alt=media`;
};

export const getGalleryImage = (id, image) => {
  return `https://firebasestorage.googleapis.com/v0/b/${
    firebaseConfig.storageBucket
  }/o/${encodeURIComponent(storagePath)}gallery%2F${id}%2F${image}?alt=media`;
};
