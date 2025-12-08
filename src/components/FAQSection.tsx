"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { faqs } from "@/lib/content/faqs";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Everything you need to know about renting GPUs for machine learning, AI training, and inference workloads.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-border rounded-lg overflow-hidden bg-card transition-all hover:shadow-md"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
            >
              <span className="font-semibold text-base md:text-lg pr-8">
                {faq.question}
              </span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
              )}
            </button>

            {openIndex === index && (
              <div className="px-6 pb-5 pt-2">
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          Still have questions?{" "}
          <a
            href="https://calendly.com/prakarshspheron/30min"
            className="text-foreground hover:underline font-medium"
          >
            Contact us
          </a>
        </p>
      </div>
    </section>
  );
}
