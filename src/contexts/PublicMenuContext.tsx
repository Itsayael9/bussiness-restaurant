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
import { collection, doc, onSnapshot } from "firebase/firestore";
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

function mapCategoryDoc(id: string, data: Record<string, unknown>): Category | null {
  if (
    !data ||
    typeof data.name !== "object" ||
    typeof data.image !== "string" ||
    typeof data.order !== "number" ||
    typeof data.active !== "boolean"
  ) {
    return null;
  }
  return {
    id,
    name: data.name as Category["name"],
    image: data.image,
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
    typeof data.price !== "number" ||
    !Array.isArray(data.allergens) ||
    typeof data.active !== "boolean" ||
    typeof data.order !== "number"
  ) {
    return null;
  }
  return {
    id,
    categoryId: data.categoryId,
    name: data.name as Dish["name"],
    description: data.description as Dish["description"],
    price: data.price,
    allergens: data.allergens as string[],
    active: data.active,
    order: data.order,
  };
}

export function PublicMenuProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
  const [sliderSlides, setSliderSlides] = useState<SliderSlide[]>([]);
  const [error, setError] = useState<string | null>(null);
  const gates = useRef({ categories: false, dishes: false, restaurant: false, slider: false });
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    setError(null);

    if (!isFirebaseConfigured || !firebaseDb) {
      setCategories(categoriesData as Category[]);
      setDishes(dishesData as Dish[]);
      setRestaurant(restaurantData as RestaurantInfo);
      setSliderSlides(sliderData as SliderSlide[]);
      setLoading(false);
      return;
    }

    const unsubCategories = onSnapshot(
      collection(firebaseDb, "categories"),
      (snap) => {
        const list: Category[] = [];
        for (const d of snap.docs) {
          const row = mapCategoryDoc(d.id, d.data() as Record<string, unknown>);
          if (row) list.push(row);
        }
        setCategories(list);
        markReady("categories");
      },
      (e) => {
        setError(e.message);
        markReady("categories");
      }
    );

    const unsubDishes = onSnapshot(
      collection(firebaseDb, "dishes"),
      (snap) => {
        const list: Dish[] = [];
        for (const d of snap.docs) {
          const row = mapDishDoc(d.id, d.data() as Record<string, unknown>);
          if (row) list.push(row);
        }
        setDishes(list);
        markReady("dishes");
      },
      (e) => {
        setError(e.message);
        markReady("dishes");
      }
    );

    const unsubRestaurant = onSnapshot(
      doc(firebaseDb, "restaurant", "main"),
      (snap) => {
        if (!snap.exists()) {
          setRestaurant(null);
        } else {
          setRestaurant(snap.data() as RestaurantInfo);
        }
        markReady("restaurant");
      },
      (e) => {
        setError(e.message);
        setRestaurant(null);
        markReady("restaurant");
      }
    );

    const unsubSlider = onSnapshot(
      collection(firebaseDb, "sliderSlides"),
      (snap) => {
        const list: SliderSlide[] = [];
        for (const d of snap.docs) {
          const data = d.data() as Record<string, unknown>;
          if (
            typeof data.url === "string" &&
            typeof data.order === "number" &&
            typeof data.active === "boolean"
          ) {
            list.push({
              id: d.id,
              url: data.url,
              order: data.order,
              active: data.active,
            });
          }
        }
        setSliderSlides(list);
        markReady("slider");
      },
      (e) => {
        setError(e.message);
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
