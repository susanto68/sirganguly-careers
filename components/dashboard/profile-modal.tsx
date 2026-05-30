"use client";

import React, { useEffect, useState } from "react";
import { X, Sparkles, Award, MapPin, Briefcase } from "lucide-react";
import type { StudentProfile } from "@/services/recommendation.service";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: StudentProfile) => void;
}

export function ProfileModal({ isOpen, onClose, onSave }: ProfileModalProps) {
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("B.Tech / BE");
  const [experienceYears, setExperienceYears] = useState(0);
  const [preferredLocation, setPreferredLocation] = useState("");
  const [careerInterests, setCareerInterests] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem("student_profile");
      if (stored) {
        try {
          const profile = JSON.parse(stored) as StudentProfile;
          setSkills(profile.skills.join(", "));
          setEducation(profile.education);
          setExperienceYears(profile.experienceYears);
          setPreferredLocation(profile.preferredLocation);
          setCareerInterests(profile.careerInterests || []);
        } catch {
          // Silent fallback
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInterestToggle = (interest: string) => {
    setCareerInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: StudentProfile = {
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      education,
      experienceYears: Number(experienceYears),
      preferredLocation: preferredLocation.trim(),
      careerInterests
    };
    localStorage.setItem("student_profile", JSON.stringify(profile));
    onSave(profile);
    onClose();
  };

  const categories = ["IT", "Government", "Internship", "Banking", "Railway", "Teaching", "Startup"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/20 bg-white shadow-glow dark:border-white/10 dark:bg-slate-900 text-ink dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-black">AI Matcher Student Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-emerald-600" /> Skills (Comma separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Java, SQL, React, Python"
              className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-sm font-semibold outline-none focus:border-emerald-600"
              required
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Highest Education
              </label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold outline-none focus:border-emerald-600"
              >
                <option>B.Tech / BE</option>
                <option>MCA / MSc</option>
                <option>BCA / BSc</option>
                <option>MBA / BBA</option>
                <option>12th Pass / Graduate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-iris" /> Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-sm font-semibold outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-coral" /> Preferred Location
            </label>
            <input
              type="text"
              value={preferredLocation}
              onChange={(e) => setPreferredLocation(e.target.value)}
              placeholder="e.g. Hyderabad, Pan India, Remote"
              className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-sm font-semibold outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Career Interests
            </label>
            <div className="flex flex-wrap gap-2 mt-1">
              {categories.map((interest) => (
                <button
                  type="button"
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                    careerInterests.includes(interest)
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-4 text-sm font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 px-5 text-sm font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
