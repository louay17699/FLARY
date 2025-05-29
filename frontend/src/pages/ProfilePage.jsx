import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Edit, Calendar, CheckCircle, LogOut, X, Check } from "lucide-react";
import toast from "react-hot-toast";
import imageCompression from 'browser-image-compression';

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, logout } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: ""
  });

  
  useEffect(() => {
    if (authUser) {
      setEditData({
        fullName: authUser.fullName || ""
      });
    }
  }, [authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading("Optimizing your profile picture...");
    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 800,
        useWebWorker: true
      });

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Image = reader.result;
          setSelectedImg(base64Image);
          await updateProfile({ profilePic: base64Image });
          toast.success("Profile picture updated!", { id: toastId });
        } catch (error) {
          toast.error("Upload failed", { id: toastId });
        }
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      toast.error("Failed to process image", { id: toastId });
    }
  };

  const handleSaveChanges = async () => {
    if (!editData.fullName.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    try {
      await updateProfile({ fullName: editData.fullName });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Your Profile
          </h1>
          <p className="mt-2 text-base-content/70">
            Manage your personal information and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1">
            <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 p-6">
              
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="relative group">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <img
                    src={selectedImg || authUser?.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="size-36 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`
                      absolute bottom-2 right-2 
                      bg-primary hover:bg-primary-focus
                      p-2 rounded-full cursor-pointer 
                      transition-all duration-200 shadow-md
                      ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                    `}
                  >
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold">{authUser?.fullName}</h2>
                  <p className="text-sm text-base-content/70">{authUser?.email}</p>
                </div>
              </div>

              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/70">Member since</p>
                    <p className="font-medium">
                      {authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <div className="p-2 rounded-full bg-green-500/10 text-green-500">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/70">Account status</p>
                    <p className="font-medium text-green-500">Active</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={logout}
                className="mt-6 w-full btn btn-outline hover:bg-error/10 hover:text-error gap-2"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>

          
          <div className="lg:col-span-2">
            <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                {isEditing ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="btn btn-ghost btn-sm gap-1"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveChanges}
                      className="btn btn-primary btn-sm gap-1"
                      disabled={isUpdatingProfile}
                    >
                      {isUpdatingProfile ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="btn btn-ghost btn-sm gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>

              <div className="space-y-6">
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={editData.fullName}
                      onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                      disabled={isUpdatingProfile}
                    />
                  ) : (
                    <div className="px-4 py-3 bg-base-200 rounded-lg">
                      {authUser?.fullName}
                    </div>
                  )}
                </div>

                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </span>
                  </label>
                  <div className="px-4 py-3 bg-base-200 rounded-lg">
                    {authUser?.email}
                  </div>
                </div>

                
                <div className="divider"></div>
                
                <div>
                  <h3 className="font-medium mb-3">About Me</h3>
                  <div className="px-4 py-3 bg-base-200 rounded-lg min-h-24">
                    {authUser?.bio || (
                      <p className="text-base-content/50 italic">
                        Tell us something about yourself...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 p-6">
                <h3 className="font-semibold mb-4">Account Security</h3>
                <button className="btn btn-outline btn-sm w-full">
                  Change Password
                </button>
              </div>
              <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 p-6">
                <h3 className="font-semibold mb-4">Preferences</h3>
                <button className="btn btn-outline btn-sm w-full">
                  Notification Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;