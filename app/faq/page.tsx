"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is the admission procedure for Nursery?",
    answer: "For Nursery admission, the child must be at least 3 years old by March 31st of the academic year. Parents need to submit the online inquiry form, followed by an informal interaction with the principal."
  },
  {
    question: "What is the student-teacher ratio in classes?",
    answer: "We maintain a healthy student-teacher ratio of 25:1 to ensure personalized attention and effective learning for every child."
  },
  {
    question: "Does the school provide transport facilities?",
    answer: "Yes, we provide safe and secure GPS-enabled school bus services covering all major routes in the city. Each bus has a female attendant."
  },
  {
    question: "Is there any provision for extra classes for weak students?",
    answer: "Absolutely. We believe in inclusive education and provide special remedial classes after school hours for students who require extra academic support."
  },
  {
    question: "What co-curricular activities are offered?",
    answer: "We offer a wide range of activities including sports (football, cricket, athletics), classical and western dance, vocal music, art & craft, and public speaking."
  },
  {
    question: "How does the school ensure student safety?",
    answer: "The entire campus is under 24/7 CCTV surveillance. We have secure entry/exit protocols, full-time security guards, and regular fire safety drills."
  }
];

function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Find answers to common questions about admissions, facilities, and school policies.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-heading font-bold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-gray-600 border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQPage;
