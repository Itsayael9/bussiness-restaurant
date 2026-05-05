import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { onValue, ref } from "firebase/database";
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import type { Category, Dish } from "@/utils/helpers";
import type { RestaurantInfo, SliderSlide } from "@/types/publicSite";
import categoriesData from "@/data/categories.json";
import dishesData from "@/data/dishes.json";
import restaurantData from "@/data/restaurant.json";
import sliderData from "@/data/sliderImages.json";

export type { RestaurantInfo, SliderSlide } from "@/types/publicSite";

interface PublicMenuState {
  categories: Category[];
  dishes: Dish[];
  restaurant: RestaurantInfo | null;
  sliderSlides: SliderSlide[];
  loading: boolean;
  error: string | null;
}

const PublicMenuContext = createContext<PublicMenuState | null>(null);

function normalizeImageUrl(value: unknown): string {
  if (typeof value !== "string") return "";
  const raw = value.trim();
  if (!raw) return "";

  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith("data:") || raw.startsWith("blob:")) {
    return raw;
  }

  const normalized = raw.replace(/\\/g, "/");

  if (/^\/?public\//i.test(normalized)) {
    return `/${normalized.replace(/^\/?public\//i, "")}`.replace(/\.webp$/i, ".png");
  }
  if (normalized.startsWith("./images/")) {
    return `/${normalized.slice(2)}`.replace(/\.webp$/i, ".png");
  }
  if (normalized.startsWith("images/")) {
    return `/${normalized}`.replace(/\.webp$/i, ".png");
  }
  if (!normalized.includes("/") && /\.(webp|png|jpe?g|gif|svg|avif)$/i.test(normalized)) {
    return `/images/${normalized}`.replace(/\.webp$/i, ".png");
  }

  const imagePathMatch = normalized.match(/(?:^|\/)images\/(.+)$/i);
  if (imagePathMatch?.[1]) {
    return `/images/${imagePathMatch[1]}`.replace(/\.webp$/i, ".png");
  }

  return normalized.replace(/(^\/images\/.+)\.webp$/i, "$1.png");
}

function mapCategoryDoc(id: string, data: Record<string, unknown>): Category | null {
  if (
    !data ||
    typeof data.name !== "object" ||
    typeof data.order !== "number" ||
    typeof data.active !== "boolean"
  ) {
    return null;
  }
  const image = normalizeImageUrl(data.image);
  if (!image) return null;
  return {
    id,
    name: data.name as Category["name"],
    image,
    order: data.order,
    active: data.active,
  };
}

function mapDishDoc(id: string, data: Record<string, unknown>): Dish | null {
  if (
    !data ||
    typeof data.categoryId !== "string" ||
    typeof data.name !== "object" ||
    typeof data.description !== "object" ||
    typeof data.price !== "number"
  ) {
    return null;
  }
  const allergens = Array.isArray(data.allergens) ? (data.allergens as string[]) : [];
  const active = typeof data.active === "boolean" ? data.active : true;
  const order = typeof data.order === "number" ? data.order : 1;
  return {
    id,
    categoryId: data.categoryId,
    name: data.name as Dish["name"],
    description: data.description as Dish["description"],
    price: data.price,
    image: normalizeImageUrl(data.image),
    allergens,
    active,
    order,
  };
}

export function PublicMenuProvider({ children }: { children: ReactNode }) {
  const fallbackCategories = categoriesData as Category[];
  const fallbackDishes = dishesData as Dish[];
  const fallbackRestaurant = restaurantData as RestaurantInfo;
  const fallbackSliderSlides = sliderData as SliderSlide[];

  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [dishes, setDishes] = useState<Dish[]>(fallbackDishes);
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(fallbackRestaurant);
  const [sliderSlides, setSliderSlides] = useState<SliderSlide[]>(fallbackSliderSlides);
  const [error, setError] = useState<string | null>(null);
  const gates = useRef({ categories: false, dishes: false, restaurant: false, slider: false });
  const [loading, setLoading] = useState(false);

  const markReady = useCallback((key: keyof typeof gates.current) => {
    gates.current[key] = true;
    const g = gates.current;
    if (g.categories && g.dishes && g.restaurant && g.slider) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    gates.current = {
      categories: false,
      dishes: false,
      restaurant: false,
      slider: false,
    };
    setLoading(false);
    setError(null);

    if (!isFirebaseConfigured || !firebaseDb) {
      setCategories(fallbackCategories);
      setDishes(fallbackDishes);
      setRestaurant(fallbackRestaurant);
      setSliderSlides(fallbackSliderSlides);
      setLoading(false);
      return;
    }

    const unsubCategories = onValue(
      ref(firebaseDb, "categories"),
      (snap) => {
        const val = snap.val();
        const list: Category[] = [];
        if (val && typeof val === "object") {
          for (const [id, data] of Object.entries(val as Record<string, Record<string, unknown>>)) {
            const row = mapCategoryDoc(id, data);
            if (row) list.push(row);
          }
        }
        setCategories(list.length > 0 ? list : fallbackCategories);
        markReady("categories");
      },
      (e) => {
        setError(e instanceof Error ? e.message : String(e));
        markReady("categories");
      }
    );

    const unsubDishes = onValue(
      ref(firebaseDb, "dishes"),
      (snap) => {
        const val = snap.val();
        const list: Dish[] = [];
        if (val && typeof val === "object") {
          for (const [id, data] of Object.entries(val as Record<string, Record<string, unknown>>)) {
            const row = mapDishDoc(id, data);
            if (row) list.push(row);
          }
        }
        setDishes(list.length > 0 ? list : fallbackDishes);
        markReady("dishes");
      },
      (e) => {
        setError(e instanceof Error ? e.message : String(e));
        markReady("dishes");
      }
    );

    const unsubRestaurant = onValue(
      ref(firebaseDb, "restaurant/main"),
      (snap) => {
        const val = snap.val();
        if (!val) {
          setRestaurant(fallbackRestaurant);
        } else {
          setRestaurant(val as RestaurantInfo);
        }
        markReady("restaurant");
      },
      (e) => {
        setError(e instanceof Error ? e.message : String(e));
        setRestaurant(fallbackRestaurant);
        markReady("restaurant");
      }
    );

    const unsubSlider = onValue(
      ref(firebaseDb, "sliderSlides"),
      (snap) => {
        const val = snap.val();
        const list: SliderSlide[] = [];
        if (val && typeof val === "object") {
          for (const [id, data] of Object.entries(val as Record<string, Record<string, unknown>>)) {
            if (
              typeof data.url === "string" &&
              typeof data.order === "number" &&
              typeof data.active === "boolean"
            ) {
              const url = normalizeImageUrl(data.url);
              if (!url) continue;
              list.push({
                id,
                url,
                order: data.order,
                active: data.active,
              });
            }
          }
        }
        setSliderSlides(list.length > 0 ? list : fallbackSliderSlides);
        markReady("slider");
      },
      (e) => {
        setError(e instanceof Error ? e.message : String(e));
        markReady("slider");
      }
    );

    return () => {
      unsubCategories();
      unsubDishes();
      unsubRestaurant();
      unsubSlider();
    };
  }, [markReady]);

  const value = useMemo<PublicMenuState>(
    () => ({
      categories,
      dishes,
      restaurant,
      sliderSlides,
      loading,
      error,
    }),
    [categories, dishes, restaurant, sliderSlides, loading, error]
  );

  return <PublicMenuContext.Provider value={value}>{children}</PublicMenuContext.Provider>;
}

export function usePublicMenu(): PublicMenuState {
  const ctx = useContext(PublicMenuContext);
  if (!ctx) {
    throw new Error("usePublicMenu must be used within PublicMenuProvider");
  }
  return ctx;
}
