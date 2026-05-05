import { push, ref, remove, set, update } from "firebase/database";
import { firebaseDb } from "@/lib/firebase";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import type { Category, Dish, LocalizedString } from "@/utils/helpers";

export type CategoryFormData = {
  name: LocalizedString;
  image: string;
  imageFile?: File | null;
  order: number;
  active: boolean;
};

export type DishFormData = {
  categoryId: string;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  image: string;
  imageFile?: File | null;
  allergens: string[];
  order: number;
  active: boolean;
};

function requireDb() {
  if (!firebaseDb) {
    throw new Error("Firebase is not configured.");
  }
  return firebaseDb;
}

async function resolveImageUrl(currentUrl: string, file: File | null | undefined, folder: string) {
  if (!file) return currentUrl;
  return uploadImageToCloudinary(file, folder);
}

export async function createCategory(data: CategoryFormData) {
  const db = requireDb();
  if (!data.imageFile && !data.image) {
    throw new Error("Please upload a category image.");
  }
  const image = await resolveImageUrl(data.image, data.imageFile, "restaurant/categories");
  const newRef = push(ref(db, "categories"));
  return set(newRef, {
    name: data.name,
    image,
    order: data.order,
    active: data.active,
  });
}

export async function updateCategory(categoryId: string, data: CategoryFormData) {
  const db = requireDb();
  const image = await resolveImageUrl(data.image, data.imageFile, "restaurant/categories");
  return update(ref(db, `categories/${categoryId}`), {
    name: data.name,
    image,
    order: data.order,
    active: data.active,
  });
}

export async function deleteCategory(categoryId: string) {
  const db = requireDb();
  return remove(ref(db, `categories/${categoryId}`));
}

export async function createDish(data: DishFormData) {
  const db = requireDb();
  const image = await resolveImageUrl(data.image, data.imageFile, "restaurant/dishes");
  const newRef = push(ref(db, "dishes"));
  return set(newRef, {
    categoryId: data.categoryId,
    name: data.name,
    description: data.description,
    price: data.price,
    image,
    allergens: data.allergens,
    order: data.order,
    active: data.active,
  });
}

export async function updateDish(dishId: string, data: DishFormData) {
  const db = requireDb();
  const image = await resolveImageUrl(data.image, data.imageFile, "restaurant/dishes");
  return update(ref(db, `dishes/${dishId}`), {
    categoryId: data.categoryId,
    name: data.name,
    description: data.description,
    price: data.price,
    image,
    allergens: data.allergens,
    order: data.order,
    active: data.active,
  });
}

export async function deleteDish(dishId: string) {
  const db = requireDb();
  return remove(ref(db, `dishes/${dishId}`));
}

export function categoryToFormData(category?: Category): CategoryFormData {
  return {
    name: category?.name ?? { es: "", en: "", ca: "" },
    image: category?.image ?? "",
    imageFile: null,
    order: category?.order ?? 1,
    active: category?.active ?? true,
  };
}

export function dishToFormData(dish?: Dish, categoryId = ""): DishFormData {
  return {
    categoryId: dish?.categoryId ?? categoryId,
    name: dish?.name ?? { es: "", en: "", ca: "" },
    description: dish?.description ?? { es: "", en: "", ca: "" },
    price: dish?.price ?? 0,
    image: (dish as Dish & { image?: string } | undefined)?.image ?? "",
    imageFile: null,
    allergens: dish?.allergens ?? [],
    order: dish?.order ?? 1,
    active: dish?.active ?? true,
  };
}
