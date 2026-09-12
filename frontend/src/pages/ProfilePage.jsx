import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  User,
  Mail,
  AtSign,
  FileText,
  Calendar,
  Edit3,
  Check,
  AlertCircle,
  Camera,
  X,
  Loader2,
  ShieldCheck,
  Upload,
  Link as LinkIcon,
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
];

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || user?.avatar_url || '',
    createdAt: user?.createdAt || user?.created_at || '',
  });

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form edit fields
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  const fileInputRef = useRef(null);

  // Sync profileData with user context whenever user changes
  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        name: user.name ?? prev.name,
        username: user.username ?? prev.username,
        email: user.email ?? prev.email,
        bio: user.bio ?? prev.bio,
        avatarUrl: user.avatarUrl ?? user.avatar_url ?? prev.avatarUrl,
        createdAt: user.createdAt ?? user.created_at ?? prev.createdAt,
      }));
    }
  }, [user]);

  // Fetch verified profile from backend on component mount
  const fetchProfile = async () => {
    if (!user) return;
    try {
      const res = await api.get('/profile');
      if (res.data?.success && res.data?.data?.user) {
        const u = res.data.data.user;
        const normalized = {
          name: u.name || '',
          username: u.username || '',
          email: u.email || '',
          bio: u.bio || '',
          avatarUrl: u.avatarUrl || u.avatar_url || '',
          createdAt: u.createdAt || u.created_at || '',
        };
        setProfileData(normalized);
        updateUserProfile(normalized);
      }
    } catch (err) {
      const isAuthErr =
        err?.message?.includes('Access denied') ||
        err?.message?.includes('expired') ||
        err?.message?.includes('token');
      if (user && !isAuthErr) console.error('Failed to load profile:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleOpenEdit = () => {
    setEditName(profileData.name);
    setEditUsername(profileData.username);
    setEditBio(profileData.bio);
    setEditAvatarUrl(profileData.avatarUrl);
    setCustomPhotoUrl(profileData.avatarUrl);
    setError('');
    setSuccessMessage('');
    setShowPhotoOptions(false);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setError('');
    setShowPhotoOptions(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (PNG, JPG, WebP).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Resize image to max 256x256 for lightweight storage and fast rendering
          const canvas = document.createElement('canvas');
          const maxDim = 256;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setEditAvatarUrl(compressedDataUrl);
          setShowPhotoOptions(false);
          setError('');
        };
        img.onerror = () => {
          setError('Failed to process the image file.');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend Validations
    if (!editName.trim()) {
      setError('Full Name is required.');
      return;
    }

    if (!editUsername.trim()) {
      setError('Username is required.');
      return;
    }

    const cleanUsername = editUsername.trim().toLowerCase();
    if (cleanUsername.length < 3 || cleanUsername.length > 30) {
      setError('Username must be between 3 and 30 characters.');
      return;
    }

    const validUsernameRegex = /^[a-z0-9_]+$/;
    if (!validUsernameRegex.test(cleanUsername)) {
      setError('Username can only contain lowercase letters, numbers, and underscores.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: editName.trim(),
        username: cleanUsername,
        bio: editBio.trim(),
        avatarUrl: editAvatarUrl.trim(),
      };

      const res = await api.put('/profile', payload);

      if (res.data.success) {
        const u = res.data.data.user;
        const updated = {
          name: u.name,
          username: u.username,
          email: u.email,
          bio: u.bio || '',
          avatarUrl: u.avatarUrl || u.avatar_url || '',
          createdAt: u.createdAt || u.created_at || profileData.createdAt,
        };

        setProfileData(updated);
        updateUserProfile(updated);
        setSuccessMessage('Profile changes saved successfully.');
        setIsEditing(false);

        // Clear success message after 4 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 4000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const initialLetter = (profileData.name || profileData.username || 'U').charAt(0).toUpperCase();

  const formattedDate = profileData.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Member';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)] gap-3">
        <Loader2 className="h-7 w-7 text-[var(--accent)] animate-spin" />
        <span className="font-sans text-xs uppercase tracking-wider font-semibold">
          Loading profile...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto space-y-6 animate-fadeIn pb-12">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-wide">
              PROFILE
            </h1>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)]">
              Account
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Manage your personal identity, credentials, and account details.
          </p>
        </div>

        <button
          onClick={handleOpenEdit}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
        >
          <Edit3 className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="flex items-center gap-2.5 p-3 rounded-sm bg-[var(--accent-soft)] border border-[var(--accent-border)] text-[var(--text-primary)] text-xs font-sans animate-fadeIn">
          <Check className="h-4 w-4 text-[var(--accent)] stroke-[2.5] shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* 2. Main Profile Card */}
      <div className="mettle-card rounded-md p-5 sm:p-7 border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] space-y-6 shadow-xs">
        {/* User Identity Banner */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-[var(--border)]">
          {/* Avatar Container */}
          <div className="relative shrink-0">
            {profileData.avatarUrl ? (
              <img
                src={profileData.avatarUrl}
                alt={profileData.name}
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-md object-cover border-2 border-[var(--border-strong)] shadow-xs bg-[var(--bg-elevated)]"
              />
            ) : (
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-md bg-[var(--bg-elevated)] border-2 border-[var(--border-strong)] flex items-center justify-center text-3xl sm:text-4xl font-black font-display text-[var(--accent)] shadow-xs">
                {initialLetter}
              </div>
            )}
            <div className="absolute -bottom-1.5 -right-1.5 p-1 rounded-xs bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--accent)]">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Core Info */}
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              {profileData.name || 'User'}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              <span className="font-mono text-xs font-semibold text-[var(--accent)]">
                @{profileData.username || 'username'}
              </span>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="text-[var(--text-secondary)] font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3 text-[var(--text-muted)]" />
                Joined {formattedDate}
              </span>
            </div>

            {/* Bio */}
            <div className="mt-3 pt-2">
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans max-w-xl">
                {profileData.bio ? (
                  profileData.bio
                ) : (
                  <span className="italic text-[var(--text-muted)]">
                    No bio added yet. Click "Edit Profile" to write something about yourself.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Account Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name Field */}
          <div className="p-3.5 rounded-sm bg-[var(--bg-primary)] border border-[var(--border)]">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              <User className="h-3.5 w-3.5" />
              <span>Full Name</span>
            </div>
            <p className="font-sans text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
              {profileData.name || 'Not provided'}
            </p>
          </div>

          {/* Username Field */}
          <div className="p-3.5 rounded-sm bg-[var(--bg-primary)] border border-[var(--border)]">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              <AtSign className="h-3.5 w-3.5" />
              <span>Username</span>
            </div>
            <p className="font-mono text-xs sm:text-sm font-bold text-[var(--text-primary)]">
              @{profileData.username || 'Not configured'}
            </p>
          </div>

          {/* Email Field (Read-only) */}
          <div className="p-3.5 rounded-sm bg-[var(--bg-primary)] border border-[var(--border)] sm:col-span-2 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                <Mail className="h-3.5 w-3.5" />
                <span>Email Address</span>
              </div>
              <p className="font-sans text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                {profileData.email}
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)]">
              Read-Only
            </span>
          </div>
        </div>
      </div>

      {/* 3. Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-md mettle-panel border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
              <div>
                <h3 className="font-display text-lg font-bold tracking-tight text-[var(--text-primary)]">
                  Edit Profile
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)] font-sans">
                  Update your public name, handle, avatar, and bio.
                </p>
              </div>
              <button
                onClick={handleCloseEdit}
                className="p-1 rounded-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto font-sans">
              {/* Error Notice */}
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-sm bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-[var(--danger)] text-xs font-sans">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Photo Upload / Selection Section */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4 p-3 rounded-sm bg-[var(--bg-primary)] border border-[var(--border)]">
                  {editAvatarUrl ? (
                    <img
                      src={editAvatarUrl}
                      alt="Avatar Preview"
                      className="h-14 w-14 rounded-md object-cover border border-[var(--border-strong)] shrink-0 bg-[var(--bg-surface)]"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-md bg-[var(--bg-surface)] border border-[var(--border-strong)] flex items-center justify-center text-xl font-bold font-display text-[var(--accent)] shrink-0">
                      {initialLetter}
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--accent)] text-xs font-semibold text-[var(--text-primary)] transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="h-3 w-3 text-[var(--accent)]" />
                        <span>Upload Image</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowPhotoOptions(!showPhotoOptions)}
                        className="px-2.5 py-1 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--accent)] text-xs font-semibold text-[var(--text-primary)] transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="h-3 w-3 text-[var(--accent)]" />
                        <span>Presets / URL</span>
                      </button>

                      {editAvatarUrl && (
                        <button
                          type="button"
                          onClick={() => setEditAvatarUrl('')}
                          className="px-2 py-1 text-[11px] font-semibold text-[var(--danger)] hover:underline cursor-pointer"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      PNG, JPG, or WebP up to 2MB.
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Preset Avatars & Image URL Drawer */}
                {showPhotoOptions && (
                  <div className="p-3 rounded-sm bg-[var(--bg-surface)] border border-[var(--border-strong)] space-y-3 animate-fadeIn">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">
                        Choose an Avatar Preset
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {PRESET_AVATARS.map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setEditAvatarUrl(url);
                              setShowPhotoOptions(false);
                            }}
                            className={`h-9 w-9 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                              editAvatarUrl === url
                                ? 'border-[var(--accent)] scale-105 shadow-xs'
                                : 'border-transparent hover:border-[var(--border-strong)]'
                            }`}
                          >
                            <img src={url} alt={`Preset ${idx + 1}`} className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[var(--border)]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                        Or Enter Direct Image URL
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://example.com/avatar.jpg"
                          value={customPhotoUrl}
                          onChange={(e) => setCustomPhotoUrl(e.target.value)}
                          className="flex-1 px-2.5 py-1 rounded-sm bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customPhotoUrl.trim()) {
                              setEditAvatarUrl(customPhotoUrl.trim());
                              setShowPhotoOptions(false);
                            }
                          }}
                          className="px-2.5 py-1 rounded-sm bg-[var(--accent)] text-[var(--accent-text)] text-xs font-bold cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Full Name Input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Full Name <span className="text-[var(--danger)]">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3 py-2 rounded-sm bg-[var(--bg-primary)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              {/* Username Input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Username <span className="text-[var(--danger)]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-mono text-[var(--text-muted)]">@</span>
                  <input
                    type="text"
                    required
                    maxLength={30}
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="alex_morgan"
                    className="w-full pl-7 pr-3 py-2 rounded-sm bg-[var(--bg-primary)] border border-[var(--border)] text-xs sm:text-sm font-mono text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>
                <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">
                  3-30 characters. Use only lowercase letters, numbers, and underscores.
                </p>
              </div>

              {/* Email (Read-Only) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Email Address
                  </label>
                  <span className="text-[10px] text-[var(--text-muted)]">Cannot be changed</span>
                </div>
                <input
                  type="email"
                  disabled
                  value={profileData.email}
                  className="w-full px-3 py-2 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text-muted)] cursor-not-allowed opacity-75"
                />
              </div>

              {/* Bio Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Bio
                  </label>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {editBio.length} / 500
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Share a short summary of what you are working on..."
                  className="w-full px-3 py-2 rounded-sm bg-[var(--bg-primary)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
                />
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  disabled={saving}
                  className="px-4 py-2 rounded-sm bg-[var(--bg-elevated)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
