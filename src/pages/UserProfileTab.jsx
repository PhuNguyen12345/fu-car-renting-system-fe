import { UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { customerService } from "@/services/customerService"

export function UserProfileTab() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState({
    fullName: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    cccd: '',
    gplxNumber: '',
    cccdUrl: '',
    gplxUrl: ''
  })
  
  const [cccdPreview, setCccdPreview] = useState(null)
  const [gplxPreview, setGplxPreview] = useState(null)
  const [uploadingCccd, setUploadingCccd] = useState(false)
  const [uploadingGplx, setUploadingGplx] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await customerService.getMyProfile()
      setProfile({
        fullName: data.fullName || '',
        dateOfBirth: data.dateOfBirth || '',
        phone: data.phone || '',
        email: data.email || '',
        cccd: data.cccd || '',
        gplxNumber: data.gplxNumber || '',
        cccdUrl: data.cccdUrl || '',
        gplxUrl: data.gplxUrl || ''
      })
      if (data.cccdUrl) setCccdPreview(data.cccdUrl)
      if (data.gplxUrl) setGplxPreview(data.gplxUrl)
    } catch (err) {
      console.error('Failed to fetch profile', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      await customerService.updateMyProfile(profile)
      alert('Cập nhật hồ sơ thành công!')
    } catch (err) {
      alert('Có lỗi xảy ra khi cập nhật hồ sơ.')
      console.error(err)
    }
  }

  const uploadToCloudinary = async (file) => {
    try {
      const sigData = await customerService.getCloudinarySignature();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', sigData.signature);
      formData.append('timestamp', sigData.timestamp);
      formData.append('api_key', sigData.apiKey);
      formData.append('folder', sigData.folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  }

  const handleCccdUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setCccdPreview(URL.createObjectURL(file));
      setUploadingCccd(true);
      try {
        const url = await uploadToCloudinary(file);
        setProfile(prev => ({ ...prev, cccdUrl: url }));
      } catch (err) {
        alert('Tải ảnh thất bại. Vui lòng thử lại.');
        setCccdPreview(null);
      } finally {
        setUploadingCccd(false);
      }
    }
  }

  const handleGplxUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setGplxPreview(URL.createObjectURL(file));
      setUploadingGplx(true);
      try {
        const url = await uploadToCloudinary(file);
        setProfile(prev => ({ ...prev, gplxUrl: url }));
      } catch (err) {
        alert('Tải ảnh thất bại. Vui lòng thử lại.');
        setGplxPreview(null);
      } finally {
        setUploadingGplx(false);
      }
    }
  }

  if (loading) return <div className="p-8 text-center">Đang tải hồ sơ...</div>

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Hồ sơ cá nhân</h2>
        <p className="text-slate-500">Quản lý thông tin cá nhân và giấy tờ xác minh của bạn.</p>
      </div>

      {/* Basic Info Form */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Thông tin cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Họ và tên</label>
            <input 
              type="text" 
              value={profile.fullName}
              onChange={(e) => setProfile({...profile, fullName: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all font-medium text-slate-900" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ngày sinh</label>
            <input 
              type="date" 
              value={profile.dateOfBirth}
              onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all font-medium text-slate-900" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Số điện thoại</label>
            <input 
              type="tel" 
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all font-medium text-slate-900" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input 
              type="email" 
              value={profile.email}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed font-medium" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Số Căn cước công dân (CCCD) *</label>
            <input 
              type="text" 
              value={profile.cccd}
              onChange={(e) => setProfile({...profile, cccd: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all font-medium text-slate-900" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Số Giấy phép lái xe (GPLX) *</label>
            <input 
              type="text" 
              value={profile.gplxNumber}
              onChange={(e) => setProfile({...profile, gplxNumber: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all font-medium text-slate-900" 
            />
          </div>
        </div>
      </div>

      {/* ID Verification */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Giấy tờ xác minh</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* CCCD Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ảnh mặt trước CCCD *</label>
            <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors h-48 bg-white">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleCccdUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                disabled={uploadingCccd}
              />
              {cccdPreview ? (
                <div className="absolute inset-2">
                  <img src={cccdPreview} alt="CCCD Preview" className={`w-full h-full object-contain rounded-lg ${uploadingCccd ? 'opacity-50' : ''}`} />
                  {uploadingCccd && <div className="absolute inset-0 flex items-center justify-center font-bold text-fpt-blue">Đang tải lên...</div>}
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-blue-50 text-fpt-blue rounded-full flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-slate-700 text-sm mb-1 text-center">Tải ảnh mặt trước CCCD</p>
                  <p className="text-xs text-slate-400 text-center">Hỗ trợ JPG, PNG (Tối đa 5MB)</p>
                </>
              )}
            </div>
          </div>

          {/* GPLX Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ảnh mặt trước Bằng lái xe (GPLX) *</label>
            <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors h-48 bg-white">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleGplxUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                disabled={uploadingGplx}
              />
              {gplxPreview ? (
                <div className="absolute inset-2">
                  <img src={gplxPreview} alt="GPLX Preview" className={`w-full h-full object-contain rounded-lg ${uploadingGplx ? 'opacity-50' : ''}`} />
                  {uploadingGplx && <div className="absolute inset-0 flex items-center justify-center font-bold text-fpt-blue">Đang tải lên...</div>}
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-blue-50 text-fpt-blue rounded-full flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-slate-700 text-sm mb-1 text-center">Tải ảnh mặt trước Bằng lái xe</p>
                  <p className="text-xs text-slate-400 text-center">Hỗ trợ JPG, PNG (Tối đa 5MB)</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-6">
        <Button onClick={handleSave} className="h-12 px-8 bg-fpt-blue hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5">
          Lưu thay đổi
        </Button>
      </div>
    </div>
  )
}
