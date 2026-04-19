import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <p className="font-display text-gold text-7xl sm:text-8xl font-bold">404</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-4">
          {t("notFound.title")}
        </h1>
        <p className="text-muted-foreground mt-3">{t("notFound.description")}</p>
        <Link to="/" className="btn-gold inline-block mt-8">
          {t("notFound.back")}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
