import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { Button } from '../components/common/Button.js';
import { Input } from '../components/common/Input.js';

export const Profile: React.FC = () => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState<string>(user?.name || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [bio, setBio] = useState<string>(user?.bio || '');
  const [city, setCity] = useState<string>(user?.location?.city || 'Bengaluru');
  const [state, setState] = useState<string>(user?.location?.state || 'Karnataka');
  const [pincode, setPincode] = useState<string>(user?.location?.pincode || '560001');
  const [saving, setSaving] = useState<boolean>(false);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateUser({
        name,
        phone,
        bio,
        location: { city, state, pincode },
      });
      success('Profile details updated successfully!');
    } catch (err: any) {
      error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-8 min-h-screen text-[#E5E5E5] bg-transparent text-left">
      <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#E10600] uppercase tracking-wider block">
            ACCOUNT PROFILE
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-black uppercase text-white">
            Restorer Profile Settings
          </h1>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded bg-[#161616] border border-[#2A2A2A] space-y-6">
        {/* User Card */}
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <div className="w-16 h-16 rounded bg-surface-raised border border-border text-text-primary font-mono text-xl flex items-center justify-center font-bold">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'RP'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-base text-text-primary">{user?.name}</h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-surface-raised text-text-secondary border border-border">
                {user?.role}
              </span>
            </div>
            <p className="text-[12px] text-text-muted">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-text-primary">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-[13px] font-medium text-text-secondary">Bio & restoration focus</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Specializing in 1980s 2-stroke Yamaha RX100 and Maruti SS80 restorations..."
              className="w-full bg-surface-raised border border-border rounded p-3 text-[13px] text-text-primary outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Input
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <Input
              label="Postal code"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
