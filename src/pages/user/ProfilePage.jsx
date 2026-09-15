import { useState } from "react";
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  Heart,
  Image as ImageIcon,
  Mail,
  MapPin,
  Palette,
  Pencil,
  Phone,
  Shield,
  ShoppingBag,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useAuth from "@/hooks/useAuth";
import { getReservations } from "@/lib/reservations";
import { getFavorites } from "@/lib/favorites";
import safeStorage from "@/lib/storage";
import { cn, getInitials } from "@/lib/utils";

const AVATAR_PRESETS = [
  { id: "admin-default", label: "Admin", url: "https://tse1.mm.bing.net/th/id/OIP.ycMiltiCgaZAx-9dVJmlYwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: "chef", label: "Chef", url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80" },
  { id: "gourmet", label: "Gourmet", url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=300&q=80" },
  { id: "barista", label: "Barista", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
  { id: "foodie", label: "Foodie", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
];

const COVER_PRESETS = [
  { id: "emerald", label: "Zaytouna Emerald", class: "bg-gradient-to-r from-emerald-800 via-teal-900 to-amber-950" },
  { id: "sunset", label: "Levantine Sunset", class: "bg-gradient-to-r from-amber-600 via-rose-700 to-purple-950" },
  { id: "midnight", label: "Midnight Blue", class: "bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950" },
  { id: "warm-gold", label: "Warm Gold", class: "bg-gradient-to-r from-amber-700 via-yellow-700 to-amber-950" },
];

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const savedProfile = safeStorage.getJSON(`profile_meta_${user?.id}`, {
    phone: "+20 100 123 4567",
    address: "Downtown, Cairo, Egypt",
    avatarUrl: "",
    coverPreset: "emerald",
    coverImageUrl: "",
  });

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(savedProfile.phone);
  const [address, setAddress] = useState(savedProfile.address);

  // Active saved appearance state
  const [avatarUrl, setAvatarUrl] = useState(savedProfile.avatarUrl || "");
  const [coverPreset, setCoverPreset] = useState(savedProfile.coverPreset || "emerald");
  const [coverImageUrl, setCoverImageUrl] = useState(savedProfile.coverImageUrl || "");

  // Draft appearance state in dialog
  const [draftAvatarUrl, setDraftAvatarUrl] = useState(avatarUrl);
  const [draftCoverPreset, setDraftCoverPreset] = useState(coverPreset);
  const [draftCoverImageUrl, setDraftCoverImageUrl] = useState(coverImageUrl);

  const handleOpenAppearance = () => {
    setDraftAvatarUrl(avatarUrl);
    setDraftCoverPreset(coverPreset);
    setDraftCoverImageUrl(coverImageUrl);
    setIsAppearanceOpen(true);
  };

  const handleRequestConfirmation = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleConfirmSaveAppearance = () => {
    setAvatarUrl(draftAvatarUrl);
    setCoverPreset(draftCoverPreset);
    setCoverImageUrl(draftCoverImageUrl);

    safeStorage.setJSON(`profile_meta_${user?.id}`, {
      phone,
      address,
      avatarUrl: draftAvatarUrl,
      coverPreset: draftCoverPreset,
      coverImageUrl: draftCoverImageUrl,
    });

    setIsConfirmOpen(false);
    setIsAppearanceOpen(false);
    toast.success("Profile appearance updated successfully!");
  };

  const handleSaveContactInfo = (e) => {
    e.preventDefault();
    if (updateUser) {
      updateUser({ name, email });
    }
    safeStorage.setJSON(`profile_meta_${user?.id}`, {
      phone,
      address,
      avatarUrl,
      coverPreset,
      coverImageUrl,
    });
    setIsEditOpen(false);
    toast.success("Profile & contact information updated successfully!");
  };

  const userReservations = getReservations().filter((res) => res.email === user?.email);
  const userFavorites = getFavorites();

  const selectedCoverPreset = COVER_PRESETS.find((p) => p.id === coverPreset) || COVER_PRESETS[0];
  const selectedDraftPreset = COVER_PRESETS.find((p) => p.id === draftCoverPreset) || COVER_PRESETS[0];

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile Card Header */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg transition-all hover:shadow-xl">
        {/* Cover Image / Gradient Header */}
        <div className="relative h-44 w-full overflow-hidden sm:h-56">
          {coverImageUrl ? (
            <img src={coverImageUrl} alt="Cover Banner" className="size-full object-cover" />
          ) : (
            <div className={cn("size-full transition-all duration-500", selectedCoverPreset.class)} />
          )}

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleOpenAppearance}
            className="absolute end-4 top-4 gap-1.5 rounded-xl bg-background/80 text-xs font-semibold backdrop-blur-md hover:bg-background shadow-md"
          >
            <Palette className="size-3.5" />
            <span>Customize Banner & Avatar</span>
          </Button>
        </div>

        {/* Content Details Area - Lower than background banner to eliminate overlap */}
        <div className="relative px-6 pb-6 pt-0 sm:px-8">
          <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-between sm:gap-6 pt-8">
            <div className="-mt-14 flex flex-col items-center sm:-mt-16 sm:flex-row sm:items-end sm:gap-5 z-10">
              {/* Avatar Circle */}
              <div className="relative group flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-card bg-primary text-3xl font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105 sm:size-32">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user?.name} className="size-full object-cover" />
                ) : (
                  <span>{getInitials(user?.name)}</span>
                )}

                <button
                  type="button"
                  onClick={handleOpenAppearance}
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  title="Change Avatar"
                >
                  <Camera className="size-6" />
                  <span className="text-[10px] font-semibold mt-1">Edit Avatar</span>
                </button>
              </div>

              {/* User Info Header - Positioned cleanly lower than cover banner */}
              <div className="mt-3 text-center sm:mt-0 sm:text-start sm:pb-1">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {user?.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary capitalize">
                    <Shield className="size-3" />
                    {user?.role}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-0 sm:pb-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setName(user?.name || "");
                  setEmail(user?.email || "");
                  setIsEditOpen(true);
                }}
                className="gap-2 rounded-xl"
              >
                <Pencil className="size-4" />
                <span>Edit Information</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Contact Info & Account Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Contact Info Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <UserCheck className="size-5 text-primary" />
            <span>Contact Details</span>
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="size-4 shrink-0 text-primary" />
              <span className="font-medium text-foreground truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="size-4 shrink-0 text-primary" />
              <span className="font-medium text-foreground">{phone}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="size-4 shrink-0 text-primary" />
              <span className="font-medium text-foreground">{address}</span>
            </div>
          </div>
        </div>

        {/* Account Activity Stats */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <ShoppingBag className="size-5 text-primary" />
            <span>Account Summary</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4 text-center">
              <p className="text-2xl font-black text-primary">{userFavorites.length}</p>
              <p className="text-xs font-semibold text-muted-foreground mt-1 flex items-center justify-center gap-1">
                <Heart className="size-3 text-destructive" />
                <span>Favorite Dishes</span>
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-4 text-center">
              <p className="text-2xl font-black text-primary">{userReservations.length}</p>
              <p className="text-xs font-semibold text-muted-foreground mt-1 flex items-center justify-center gap-1">
                <CalendarDays className="size-3 text-primary" />
                <span>Reservations</span>
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-xl border border-border/60 bg-muted/30 p-4 text-center">
              <p className="text-2xl font-black text-primary capitalize">{user?.role}</p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">Account Role</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Information Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="size-5 text-primary" />
              <span>Edit Personal Information</span>
            </DialogTitle>
            <DialogDescription>
              Update your full name, email address, phone number, and delivery address.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveContactInfo} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Admin User"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@techmaster.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 100 123 4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Delivery Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Downtown, Cairo, Egypt"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Appearance (Avatar & Cover Background) Dialog with Fixed Header/Footer & Sleek Scrollbar */}
      <Dialog open={isAppearanceOpen} onOpenChange={setIsAppearanceOpen}>
        <DialogContent className="max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl sm:max-w-md">
          {/* Fixed Modal Header */}
          <DialogHeader className="sticky top-0 z-10 shrink-0 border-b border-border bg-card px-6 py-4">
            <DialogTitle className="flex items-center gap-2">
              <Palette className="size-5 text-primary" />
              <span>Customize Profile Banner & Avatar</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Select presets or provide custom image URLs. Live preview updates automatically.
            </DialogDescription>
          </DialogHeader>

          {/* Form Body with Sleek Custom Scrollbar */}
          <form onSubmit={handleRequestConfirmation} className="flex flex-col min-h-0 flex-1">
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              {/* Live Preview Card */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Live Preview
                </Label>
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
                  <div className="relative h-24 w-full overflow-hidden">
                    {draftCoverImageUrl ? (
                      <img src={draftCoverImageUrl} alt="Preview" className="size-full object-cover" />
                    ) : (
                      <div className={cn("size-full", selectedDraftPreset.class)} />
                    )}
                  </div>
                  <div className="relative p-3 pt-0 flex items-end gap-3">
                    <div className="-mt-8 flex size-14 items-center justify-center overflow-hidden rounded-xl border-2 border-card bg-primary font-bold text-primary-foreground text-lg shadow-md">
                      {draftAvatarUrl ? (
                        <img src={draftAvatarUrl} alt="Avatar Preview" className="size-full object-cover" />
                      ) : (
                        getInitials(user?.name)
                      )}
                    </div>
                    <div className="pb-1">
                      <p className="text-sm font-bold text-foreground">{user?.name}</p>
                      <p className="text-[11px] text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Avatar Presets Gallery */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
                  <Camera className="size-3.5 text-primary" />
                  <span>Choose Preset Avatar</span>
                </Label>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setDraftAvatarUrl(preset.url)}
                      className={cn(
                        "group relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 transition-all hover:scale-105",
                        draftAvatarUrl === preset.url
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-border hover:border-muted-foreground"
                      )}
                      title={preset.label}
                    >
                      <img src={preset.url} alt={preset.label} className="size-full object-cover" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setDraftAvatarUrl("")}
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-xl border-2 text-xs font-bold transition-all hover:scale-105",
                      !draftAvatarUrl
                        ? "border-primary bg-primary text-primary-foreground ring-2 ring-primary/30"
                        : "border-border bg-muted/40 text-muted-foreground"
                    )}
                    title="Initials Avatar"
                  >
                    {getInitials(user?.name)}
                  </button>
                </div>
              </div>

              {/* Custom Avatar URL */}
              <div className="space-y-2">
                <Label htmlFor="avatar-url" className="flex items-center gap-1.5 font-semibold text-xs">
                  <Camera className="size-3.5 text-muted-foreground" />
                  <span>Or Custom Avatar URL</span>
                </Label>
                <Input
                  id="avatar-url"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={draftAvatarUrl}
                  onChange={(e) => setDraftAvatarUrl(e.target.value)}
                />
              </div>

              {/* Cover Gradient Presets */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 font-semibold text-xs">
                  <Palette className="size-3.5 text-muted-foreground" />
                  <span>Choose Cover Banner Gradient</span>
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {COVER_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setDraftCoverPreset(preset.id);
                        setDraftCoverImageUrl("");
                      }}
                      className={cn(
                        "flex h-11 flex-col justify-center rounded-xl p-2.5 text-start text-xs font-bold text-white shadow-xs transition-all hover:opacity-95",
                        preset.class,
                        draftCoverPreset === preset.id && !draftCoverImageUrl && "ring-2 ring-primary ring-offset-2 ring-offset-card"
                      )}
                    >
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Cover Image URL */}
              <div className="space-y-2">
                <Label htmlFor="cover-url" className="flex items-center gap-1.5 font-semibold text-xs">
                  <ImageIcon className="size-3.5 text-muted-foreground" />
                  <span>Or Custom Cover Image URL</span>
                </Label>
                <Input
                  id="cover-url"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={draftCoverImageUrl}
                  onChange={(e) => setDraftCoverImageUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Fixed Modal Footer */}
            <DialogFooter className="sticky bottom-0 z-10 shrink-0 border-t border-border bg-card px-6 py-3.5 flex flex-row items-center justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAppearanceOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save & Apply Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Step Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-2xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-primary" />
              <span>Confirm Profile Image Changes</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update your profile cover banner and avatar image?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSaveAppearance}>
              Yes, Confirm & Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ProfilePage;