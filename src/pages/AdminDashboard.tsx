import { FormEvent, MouseEvent, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { ChevronLeft, ChevronDown, Edit, LogOut, Plus, Save, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { ADMIN_ROUTE } from "@/lib/adminConstants";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { usePublicMenu } from "@/contexts/PublicMenuContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  categoryToFormData,
  createCategory,
  createDish,
  deleteCategory,
  deleteDish,
  dishToFormData,
  updateCategory,
  updateDish,
  type CategoryFormData,
  type DishFormData,
} from "@/lib/adminData";
import { translateFromSpanish } from "@/lib/translation";
import type { Category, Dish } from "@/utils/helpers";

type ModalMode = "category" | "dish" | null;

const fileInputClass =
  "flex h-12 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-1 file:text-white";

const AdminDashboard = () => {
  const { ready, user, logout, changePassword } = useAdminAuth();
  const { categories, dishes } = usePublicMenu();
  const { lang } = useLanguage();
  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.order - b.order),
    [categories]
  );

  const [currentCategoryId, setCurrentCategoryId] = useState("");
  const [selectedDishId, setSelectedDishId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>(categoryToFormData());
  const [dishForm, setDishForm] = useState<DishFormData>(dishToFormData(undefined, sortedCategories[0]?.id || ""));
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "" });
  const [busy, setBusy] = useState(false);

  if (ready && !user) return <Navigate to={`${ADMIN_ROUTE}/login`} replace />;

  const currentCategory = sortedCategories.find((category) => category.id === currentCategoryId) || null;
  const categoryDishes = useMemo(
    () =>
      dishes
        .filter((dish) => dish.categoryId === currentCategoryId)
        .sort((a, b) => a.order - b.order),
    [dishes, currentCategoryId]
  );

  const openCategoryForm = (category?: Category) => {
    setError("");
    setStatus("");
    setSelectedCategoryId(category?.id || "");
    setCategoryForm(categoryToFormData(category));
    setModalMode("category");
  };

  const openDishForm = (dish?: Dish) => {
    setError("");
    setStatus("");
    setSelectedDishId(dish?.id || "");
    setDishForm(dishToFormData(dish, dish?.categoryId || currentCategoryId || sortedCategories[0]?.id || ""));
    setModalMode("dish");
  };

  const editCategory = (event: MouseEvent, category: Category) => {
    event.stopPropagation();
    openCategoryForm(category);
  };

  const removeCategory = (event: MouseEvent, category: Category) => {
    event.stopPropagation();
    if (!window.confirm(`Delete category "${category.name.es}"?`)) return;
    void runAction(async () => {
      await deleteCategory(category.id);
      if (currentCategoryId === category.id) setCurrentCategoryId("");
    }, "Category deleted.");
  };

  const editDish = (dish: Dish) => {
    openDishForm(dish);
  };

  const removeDish = (dish: Dish) => {
    if (!window.confirm(`Delete plate "${dish.name.es}"?`)) return;
    void runAction(async () => {
      await deleteDish(dish.id);
    }, "Plate deleted.");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedCategoryId("");
    setSelectedDishId("");
  };

  const selectCategory = (category: Category) => {
    setCurrentCategoryId(category.id);
    setSelectedCategoryId(category.id);
    setCategoryForm(categoryToFormData(category));
  };

  const selectDish = (dish: Dish) => {
    setSelectedDishId(dish.id);
    setDishForm(dishToFormData(dish, dish.categoryId));
  };

  const resetMessages = () => {
    setStatus("");
    setError("");
  };

  const runAction = async (action: () => Promise<unknown>, success: string) => {
    resetMessages();
    setBusy(true);
    try {
      await action();
      setStatus(success);
      setModalMode(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setBusy(false);
    }
  };

  const saveCategory = (event: FormEvent) => {
    event.preventDefault();
    void runAction(
      () => (selectedCategoryId ? updateCategory(selectedCategoryId, categoryForm) : createCategory(categoryForm)),
      selectedCategoryId ? "Category updated." : "Category created."
    );
  };

  const saveDish = (event: FormEvent) => {
    event.preventDefault();
    void runAction(
      () => (selectedDishId ? updateDish(selectedDishId, dishForm) : createDish(dishForm)),
      selectedDishId ? "Dish updated." : "Dish created."
    );
  };

  const autoTranslateDishName = async () => {
    await runAction(async () => {
      const translated = await translateFromSpanish(dishForm.name.es);
      setDishForm((prev) => ({
        ...prev,
        name: { ...prev.name, en: translated.en, ca: translated.ca },
      }));
    }, "Name translated. You can edit the result before saving.");
  };

  const updateAdminPassword = (event: FormEvent) => {
    event.preventDefault();
    void runAction(async () => {
      await changePassword(passwordForm.current, passwordForm.next);
      setPasswordForm({ current: "", next: "" });
    }, "Password updated.");
  };

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-foreground">
      <header className="sticky top-0 z-40 bg-[#fbfaf7]/95 backdrop-blur border-b border-black/5">
        <div className="mx-auto max-w-7xl h-20 px-6 flex items-center justify-between gap-4">
          <img src="/logo.png" alt="Restaurant Business logo" className="h-12 w-12 rounded-full object-cover" />
          <p className="hidden sm:block text-sm font-medium text-muted-foreground">
            Bienvenido admin
          </p>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <div className="relative">
              <button
                onClick={() => setProfileOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full bg-gold text-white px-3 py-2 shadow-soft"
              >
                <UserRound size={18} />
                <ChevronDown size={14} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-3xl border border-border bg-white shadow-elegant p-5 z-50">
                  <p className="font-semibold">Youssef</p>
                  <p className="text-sm text-muted-foreground mb-4">{user?.email || "youssef@restaurant-admin.local"}</p>
                  <form onSubmit={updateAdminPassword} className="space-y-3">
                    <Input
                      type="password"
                      placeholder="Current password"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
                    />
                    <Input
                      type="password"
                      placeholder="New password"
                      value={passwordForm.next}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, next: e.target.value }))}
                    />
                    <Button type="submit" className="w-full rounded-full" disabled={busy || passwordForm.next.length < 6}>
                      Change password
                    </Button>
                  </form>
                  <button
                    onClick={() => void logout()}
                    className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-destructive"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 space-y-8">
        {(status || error) && (
          <div
            className={`rounded-2xl border px-5 py-4 text-sm ${
              error ? "border-destructive text-destructive" : "border-gold/30 bg-gold/5 text-gold"
            }`}
          >
            {error || status}
          </div>
        )}

        {!currentCategory ? (
          <section>
            <div className="flex items-center justify-between gap-4 mb-8">
              <h1 className="font-display text-5xl sm:text-6xl text-foreground">Dashboard</h1>
              <Button
                type="button"
                onClick={() => openCategoryForm()}
                className="rounded-2xl h-14 px-6 text-base shadow-gold"
              >
                <Plus /> Nueva Categoria
              </Button>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {sortedCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => selectCategory(category)}
                  className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-secondary shadow-soft text-left"
                >
                  <img src={category.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                  <div className="absolute right-4 top-4 flex gap-2">
                    <span
                      onClick={(event) => editCategory(event, category)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-gold shadow-soft hover:bg-white"
                    >
                      <Edit size={17} />
                    </span>
                    <span
                      onClick={(event) => removeCategory(event, category)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-gold shadow-soft hover:bg-white"
                    >
                      <Trash2 size={17} />
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-white drop-shadow">
                      {category.name[lang]}
                    </h2>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <button
                  onClick={() => setCurrentCategoryId("")}
                  className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold"
                >
                  <ChevronLeft size={17} /> Volver categorias
                </button>
                <h1 className="font-display text-4xl sm:text-6xl text-foreground">
                  {currentCategory.name[lang]}
                </h1>
              </div>
              <Button
                type="button"
                onClick={() => openDishForm()}
                className="rounded-2xl h-14 px-6 text-base shadow-gold"
              >
                <Plus /> Nuevo Plato
              </Button>
            </div>

            <div className="rounded-3xl bg-white shadow-soft overflow-hidden">
              <div className="divide-y divide-border">
                {categoryDishes.map((dish) => (
                  <div key={dish.id} className="grid grid-cols-[70px_1fr] sm:grid-cols-[82px_1.2fr_1.6fr_110px_70px_90px] gap-4 items-center px-4 sm:px-6 py-4">
                    <img
                      src={dish.image || currentCategory.image}
                      alt=""
                      className="h-14 w-14 rounded-xl object-cover bg-secondary"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-base sm:text-lg text-foreground">{dish.name[lang]}</p>
                      <p className="sm:hidden text-sm text-muted-foreground mt-1">€{dish.price.toFixed(2)}</p>
                    </div>
                    <p className="hidden sm:block text-muted-foreground leading-relaxed">
                      {dish.description[lang]}
                    </p>
                    <p className="hidden sm:block text-lg font-medium">€{dish.price.toFixed(2)}</p>
                    <p className="hidden sm:block text-muted-foreground">{dish.active ? "Sí" : "No"}</p>
                    <div className="col-span-2 sm:col-span-1 flex justify-end gap-2">
                      <button
                        onClick={() => editDish(dish)}
                        className="h-9 w-9 rounded-full border border-border bg-white flex items-center justify-center text-gold hover:bg-secondary"
                        aria-label="Edit plate"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => removeDish(dish)}
                        className="h-9 w-9 rounded-full border border-border bg-white flex items-center justify-center text-gold hover:bg-secondary"
                        aria-label="Delete plate"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {categoryDishes.length === 0 && (
                  <div className="px-6 py-16 text-center text-muted-foreground">
                    No plates in this category yet.
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-elegant p-6 sm:p-8">
            {modalMode === "category" ? (
              <form onSubmit={saveCategory} className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-display text-4xl">
                    {selectedCategoryId ? "Editar Categoria" : "Nueva Categoria"}
                  </h2>
                  <button type="button" onClick={closeModal} className="text-muted-foreground">Cerrar</button>
                </div>
                <Input placeholder="Nombre ES" value={categoryForm.name.es} onChange={(e) => setCategoryForm((p) => ({ ...p, name: { ...p.name, es: e.target.value } }))} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input placeholder="Name EN" value={categoryForm.name.en} onChange={(e) => setCategoryForm((p) => ({ ...p, name: { ...p.name, en: e.target.value } }))} />
                  <Input placeholder="Nom CA" value={categoryForm.name.ca} onChange={(e) => setCategoryForm((p) => ({ ...p, name: { ...p.name, ca: e.target.value } }))} />
                </div>
                {selectedCategoryId && categoryForm.image && (
                  <div className="flex items-center gap-3 rounded-2xl border border-border p-3">
                    <img src={categoryForm.image} alt="" className="h-16 w-20 rounded-xl object-cover bg-secondary" />
                    <p className="text-sm text-muted-foreground">Upload a new image only if you want to replace the current one.</p>
                  </div>
                )}
                <input className={fileInputClass} type="file" accept="image/*" required={!selectedCategoryId} onChange={(e) => setCategoryForm((p) => ({ ...p, imageFile: e.target.files?.[0] || null }))} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input type="number" placeholder="Order" value={categoryForm.order} onChange={(e) => setCategoryForm((p) => ({ ...p, order: Number(e.target.value) }))} />
                  <label className="flex items-center gap-2 rounded-2xl border border-border px-4">
                    <input type="checkbox" checked={categoryForm.active} onChange={(e) => setCategoryForm((p) => ({ ...p, active: e.target.checked }))} />
                    Active
                  </label>
                </div>
                <Button type="submit" disabled={busy} className="w-full h-14 rounded-2xl text-base">
                  <Save /> Save Category
                </Button>
              </form>
            ) : (
              <form onSubmit={saveDish} className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-display text-4xl">
                    {selectedDishId ? "Editar Plato" : "Nuevo Plato"}
                  </h2>
                  <button type="button" onClick={closeModal} className="text-muted-foreground">Cerrar</button>
                </div>
                <select
                  value={dishForm.categoryId}
                  onChange={(e) => setDishForm((p) => ({ ...p, categoryId: e.target.value }))}
                  className="h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm"
                >
                  <option value="">Select category</option>
                  {sortedCategories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name.es}</option>
                  ))}
                </select>
                <div className="flex gap-3">
                  <Input className="flex-1" placeholder="Nombre ES" value={dishForm.name.es} onChange={(e) => setDishForm((p) => ({ ...p, name: { ...p.name, es: e.target.value } }))} />
                  <Button type="button" variant="outline" onClick={() => void autoTranslateDishName()}>
                    Traducir
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input placeholder="Name EN" value={dishForm.name.en} onChange={(e) => setDishForm((p) => ({ ...p, name: { ...p.name, en: e.target.value } }))} />
                  <Input placeholder="Nom CA" value={dishForm.name.ca} onChange={(e) => setDishForm((p) => ({ ...p, name: { ...p.name, ca: e.target.value } }))} />
                </div>
                <Textarea placeholder="Descripción ES" value={dishForm.description.es} onChange={(e) => setDishForm((p) => ({ ...p, description: { ...p.description, es: e.target.value } }))} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Textarea placeholder="Description EN" value={dishForm.description.en} onChange={(e) => setDishForm((p) => ({ ...p, description: { ...p.description, en: e.target.value } }))} />
                  <Textarea placeholder="Descripció CA" value={dishForm.description.ca} onChange={(e) => setDishForm((p) => ({ ...p, description: { ...p.description, ca: e.target.value } }))} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input type="number" step="0.01" placeholder="Price" value={dishForm.price} onChange={(e) => setDishForm((p) => ({ ...p, price: Number(e.target.value) }))} />
                  <Input type="number" placeholder="Order" value={dishForm.order} onChange={(e) => setDishForm((p) => ({ ...p, order: Number(e.target.value) }))} />
                </div>
                <Input placeholder="Image URL" value={dishForm.image} onChange={(e) => setDishForm((p) => ({ ...p, image: e.target.value }))} />
                <input className={fileInputClass} type="file" accept="image/*" onChange={(e) => setDishForm((p) => ({ ...p, imageFile: e.target.files?.[0] || null }))} />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={dishForm.active} onChange={(e) => setDishForm((p) => ({ ...p, active: e.target.checked }))} />
                  Disponible
                </label>
                <Button type="submit" disabled={busy || !dishForm.categoryId} className="w-full h-14 rounded-2xl text-base">
                  <Save /> Save Plate
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminDashboard;
