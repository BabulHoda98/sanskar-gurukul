"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, CalendarClock, School } from "lucide-react";

const formSchema = z.object({
  studentName: z.string().min(2, "Student name is required"),
  parentName: z.string().min(2, "Parent name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Valid phone number is required"),
  class: z.string().min(1, "Please select a class"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function AdmissionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(data);
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Banner */}
      <div className="bg-primary pt-20 pb-24 text-center px-4">
        <motion.h1
          className="text-4xl md:text-5xl font-heading font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Admission Open
        </motion.h1>
        <motion.p
          className="text-blue-100 text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Session 2026-27 is now open for enrollment from Nursery to Class V.
        </motion.p>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Section */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold font-heading mb-4 flex items-center text-gray-900">
                <CalendarClock className="w-5 h-5 mr-2 text-primary" /> Process
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2"><span className="font-bold text-primary">1.</span> Submit Inquiry Form</li>
                <li className="flex gap-2"><span className="font-bold text-primary">2.</span> School Visit & Counseling</li>
                <li className="flex gap-2"><span className="font-bold text-primary">3.</span> Interaction / Basic Assessment</li>
                <li className="flex gap-2"><span className="font-bold text-primary">4.</span> Document Verification</li>
                <li className="flex gap-2"><span className="font-bold text-primary">5.</span> Fee Payment & Admission</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold font-heading mb-4 flex items-center text-gray-900">
                <FileText className="w-5 h-5 mr-2 text-primary" /> Documents Required
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                <li>Birth Certificate</li>
                <li>Aadhar Card (Student & Parents)</li>
                <li>Previous Year Marksheet (if applicable)</li>
                <li>Transfer Certificate (TC)</li>
                <li>Passport size photographs</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-bold font-heading mb-4 flex items-center text-gray-900">
                <School className="w-5 h-5 mr-2 text-primary" /> Eligibility
              </h3>
              <p className="text-sm text-gray-600">
                Admission is granted purely on merit and availability of seats. For Nursery, the child must be at least 3 years old by March 31st.
              </p>
            </motion.div>
          </div>

          {/* Form Section */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6 sm:p-10 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-3xl font-heading font-bold text-gray-900">Apply Now</h2>
              <p className="text-gray-500 mt-2">Fill out the form below and our admission counselor will contact you.</p>
            </div>

            {isSuccess && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-3 border border-green-200">
                <CheckCircle2 className="w-6 h-6" />
                <div>
                  <p className="font-bold">Application Submitted!</p>
                  <p className="text-sm">Thank you. We will get back to you shortly.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Student's Name *</label>
                  <input
                    {...register("studentName")}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none transition-all ${errors.studentName ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-primary"}`}
                    placeholder="Enter student's full name"
                  />
                  {errors.studentName && <p className="text-red-500 text-xs mt-1">{errors.studentName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Parent/Guardian Name *</label>
                  <input
                    {...register("parentName")}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none transition-all ${errors.parentName ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-primary"}`}
                    placeholder="Enter parent's full name"
                  />
                  {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                  <input
                    {...register("phone")}
                    type="tel"
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none transition-all ${errors.phone ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-primary"}`}
                    placeholder="10-digit mobile number"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address (Optional)</label>
                  <input
                    {...register("email")}
                    type="email"
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none transition-all ${errors.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-primary"}`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Admission for Class *</label>
                  <select
                    {...register("class")}
                    className={`w-full px-4 py-2.5 rounded-lg border bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all ${errors.class ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-primary"}`}
                  >
                    <option value="">Select a class</option>
                    <option value="Nursery">Nursery</option>
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    <option value="Class I">Class I</option>
                    <option value="Class II">Class II</option>
                    <option value="Class III">Class III</option>
                    <option value="Class IV">Class IV</option>
                    <option value="Class V">Class V</option>
                    <option value="Class VI">Class VI</option>
                    <option value="Class VII">Class VII</option>
                    <option value="Class VIII">Class VIII</option>
                  </select>
                  {errors.class && <p className="text-red-500 text-xs mt-1">{errors.class.message}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    {...register("message")}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    placeholder="Any specific query or information..."
                  ></textarea>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto h-12 px-8 text-base bg-gradient-to-r from-primary to-blue-600"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AdmissionPage;
