import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { formatDate } from "@/lib/format";

function getInitials(name) {
  return (name || "?")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const details = [
    { label: t("profile.fullName"), value: user?.name },
    { label: t("profile.email"), value: user?.email },
    { label: t("profile.memberSince"), value: formatDate(user?.createdAt) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {t("profile.title")}
      </h1>
      <p className="mt-1 text-muted-foreground">
        {t("profile.subtitle")}
      </p>

      <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
          {getInitials(user?.name)}
        </div>

        <dl className="grid w-full flex-1 gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:grid-cols-2">
          {details.map((detail) => (
            <div key={detail.label}>
              <dt className="text-sm font-medium text-muted-foreground">{detail.label}</dt>
              <dd className="mt-1 text-base font-semibold text-foreground">
                {detail.value || "—"}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/orders">{t("profile.viewOrders")}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/menu">{t("profile.browseMenu")}</Link>
        </Button>
      </div>
    </div>
  );
}

export default ProfilePage;