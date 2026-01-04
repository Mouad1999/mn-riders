"use client"

import { useState } from "react"
import { Mail, User, Phone, MapPin, ImagePlus } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"

export default function ContactForm() {
  const { lang } = useLanguage()
  const t = translations[lang]

  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    subject: "",
    message: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.fullName || !form.email || !form.message) {
      alert(t.errorRequired)
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      )

      formData.append("lang", lang)

      if (file) {
        formData.append("image", file)
      }

      const res = await fetch("/api/send-email/contact", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error()

      alert(
        lang === "fr"
          ? "Message envoyé avec succès ✅"
          : "Message sent successfully ✅"
      )

      setForm({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        subject: "",
        message: "",
      })
      setFile(null)
      setFileName("")
    } catch {
      alert(t.errorOrder)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-5xl font-extrabold text-black mb-4">
            {t.contactFormTitle.split(" ")[0]}{" "}
            <span className="text-red-600">
              {t.contactFormTitle.split(" ").slice(1).join(" ")}
            </span>
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
            {t.contactFormSubtitle}
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-10">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            {/* FULL NAME */}
            <Input
              label={t.fullName}
              icon={<User size={18} />}
              value={form.fullName}
              placeholder={t.fullNamePlaceholder}
              onChange={(v) => setForm({ ...form, fullName: v })}
            />

            {/* EMAIL */}
            <Input
              label={t.email}
              icon={<Mail size={18} />}
              type="email"
              value={form.email}
              placeholder={t.emailPlaceholder}
              onChange={(v) => setForm({ ...form, email: v })}
            />

            {/* PHONE */}
            <Input
              label={t.phone}
              icon={<Phone size={18} />}
              value={form.phone}
              placeholder={t.phonePlaceholder}
              onChange={(v) => setForm({ ...form, phone: v })}
            />

            {/* ADDRESS */}
            <Input
              label={t.address}
              icon={<MapPin size={18} />}
              value={form.address}
              placeholder={t.addressPlaceholder}
              onChange={(v) => setForm({ ...form, address: v })}
            />

            {/* SUBJECT */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">
                {t.subject}
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500"
                placeholder={t.subjectPlaceholder}
                value={form.subject}
                onChange={(e) =>
                  setForm({ ...form, subject: e.target.value })
                }
              />
            </div>

            {/* MESSAGE */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">
                {t.message}
              </label>
              <textarea
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 resize-none focus:ring-2 focus:ring-red-500"
                placeholder={t.messagePlaceholder}
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">
                {t.attachImage}
              </label>
              <label className="flex items-center gap-3 px-4 py-3 border border-dashed rounded-lg cursor-pointer hover:border-red-500">
                <ImagePlus />
                <span className="text-sm">
                  {fileName || t.uploadPlaceholder}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) {
                      setFile(f)
                      setFileName(f.name)
                    }
                  }}
                />
              </label>
            </div>

            {/* SUBMIT */}
            <div className="md:col-span-2 pt-4">
              <button
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white text-lg
                  bg-gradient-to-r from-[#1f1f1f] via-[#2a2a2a] to-[#4a4a4a]
                  shadow-lg hover:-translate-y-[1px] transition-all disabled:opacity-60"
              >
                {loading ? t.sending : t.sendMessage}
              </button>
            </div>

          </form>
        </div>
      </div>
    </section>
  )
}

/* SMALL HELPER */
function Input({
  label,
  icon,
  value,
  placeholder,
  onChange,
  type = "text",
}: any) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-3.5 text-gray-400">{icon}</span>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500"
        />
      </div>
    </div>
  )
}
