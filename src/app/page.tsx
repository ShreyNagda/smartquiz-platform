"use client";

import React, { FormEvent, useState } from "react";
import {
  Brain,
  Users,
  Clock,
  FileText,
  Download,
  Zap,
  CheckCircle,
  Star,
  Hash,
  ArrowRight,
} from "lucide-react";
import LoginButton from "@/components/Buttons/LoginButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";

type Feature = {
  icon: React.ReactNode;
  title: string;
  desc: string;
};

type Stat = {
  value: string | number;
  title: string;
};

type StepOrBenefit = {
  title: string;
  desc: string;
};

type Testimonial = {
  stars: number;
  message: string;
  name: string;
  desg: string;
};

export default function Home() {
  const [quizCode, setQuizCode] = useState("");

  const stats: Stat[] = [
    { value: "1k+", title: "Active Teachers" },
    { value: "100+", title: "Quiz Created" },
    { value: "1k0+", title: "Students Tested" },
    { value: "90%", title: "Satisfaction Rate" },
  ];
  const features: Feature[] = [
    {
      icon: <Brain />,
      title: "AI Question Generation",
      desc: " Generate quiz questions instantly using AI. Simply provide a topic or upload content, and let our AI create engaging questions for you.",
    },
    {
      icon: <Users />,
      title: "No Student Signup Required",
      desc: "Students can join quizzes instantly with just a quiz code. No lengthy registration process, no barriers to learning.",
    },
    {
      icon: <FileText />,
      title: "File-Based Question Import",
      desc: "Upload your existing question banks from Word, Excel, or text files. Our system intelligently parses and formats them.",
    },
    {
      icon: <Clock />,
      title: "Time Management",
      desc: "Set custom time limits for entire quizzes or individual questions. Real-time countdown keeps students focused.",
    },
    {
      icon: <Download />,
      title: "Excel & PDF Reports",
      desc: "Download detailed student responses in Excel format and comprehensive reports in PDF for easy analysis and record-keeping.",
    },
    {
      icon: <Zap />,
      title: "Real-Time Dashboard",
      desc: "Monitor quiz progress in real-time. See who's online, track completion rates, and manage everything from one place.",
    },
  ];
  const steps: StepOrBenefit[] = [
    {
      title: "Create Your Quiz",
      desc: "Add questions manually, upload from files, or generate using AI. Set time limits and configure settings.",
    },
    {
      title: "Share Quiz Code",
      desc: "Get a unique quiz code and share it with your students. They can join instantly without creating an account.",
    },
    {
      title: "Analyze Results",
      desc: "Monitor progress in real-time and download detailed reports in Excel and PDF formats when complete.",
    },
  ];
  const benefits: StepOrBenefit[] = [
    {
      title: "Save Time",
      desc: "Reduce quiz creation time by 80% with AI assistance",
    },
    {
      title: "Increase Engagement",
      desc: "Interactive quizzes keep students more engaged",
    },
    {
      title: "Better Insights",
      desc: "Detailed analytics help identify learning gaps",
    },
    {
      title: "Easy Management",
      desc: "Streamlined dashboard for all your quiz needs",
    },
  ];
  const testimonials: Testimonial[] = [
    {
      stars: 4,
      message:
        "SmartQuiz has revolutionized how I conduct assessments. The AI question generation saves me hours every week!",
      name: "Ms. Sharma",
      desg: "High School Teacher",
    },
    {
      stars: 5,
      message:
        "The Excel and PDF reporting features are exactly what I needed for parent-teacher conferences. Professional and comprehensive.",
      name: "Ms. Yadav",
      desg: "School Teacher",
    },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/quiz`, {
      method: "POST",
      body: JSON.stringify({ code: quizCode }),
    });
    const data = await res.json();
    redirect(`/quiz/${data._id}?code=${quizCode}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background to-background/50 py-5 md:py-20 border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Create & Conduct <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white">
                Smart Quizzes
              </span>{" "}
              Instantly
            </h1>
            <p className="md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Empower teachers with AI-powered quiz creation. Students join
              instantly without signup. Manage everything from one dashboard and
              get detailed reports in Excel and PDF formats.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-[650px] mx-auto">
              <LoginButton className="min-w-[300px] py-4 h-[50px] hover:bg-primary/60">
                Start Creating Quizzes
              </LoginButton>

              <Button
                variant={"outline"}
                className="min-w-[300px] border-[1.5px] text-foreground text-lg font-semibold hover:border-primary hover:text-primary transition-all"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Quiz Section */}
      <section className="py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-success/10 to-primary/10 rounded-3xl p-8 md:p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success rounded-2xl mb-6">
                <Hash className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Join a Quiz
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Have a quiz code? Enter it below to join the quiz instantly. No
                signup required!
              </p>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Input
                    type="text"
                    placeholder="Enter Quiz Code"
                    className="w-full px-2 py-2  text-lg border-2 border-border rounded-xl outline-none transition-all text-center font-mono tracking-wider"
                    maxLength={6}
                    value={quizCode}
                    onChange={(ev) => setQuizCode(ev.target.value)}
                    required
                  />
                  <Button
                    variant={"secondary"}
                    type="submit"
                    className="py-2 px-8 text-lg rounded-xl"
                  >
                    <span>Join Quiz</span>
                  </Button>
                </div>
              </form>
              <div className="mt-6 text-sm text-muted-foreground">
                Quiz codes are typically 6-8 characters long (e.g., ABC123,
                QUIZ2024)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need for Smart Quizzing
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From AI-powered question generation to detailed analytics,
              SmartQuiz provides all the tools modern educators need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl hover:shadow-lg transition-shadow ${
                  index % 2 === 0 ? " bg-primary/10" : "bg-accent/20"
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                  <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Creating and conducting quizzes has never been easier. Follow
              these simple steps to get started.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div className="text-center" key={index}>
                <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mx-2 md:mx-10 py-20 bg-gradient-to-r from-primary/10 to-secondary text-white rounded-md shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Teachers Love SmartQuiz
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of educators who&apos;ve transformed their teaching
              with SmartQuiz.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div className="text-center" key={index}>
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              What Educators Are Saying
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                className="bg-background/50 p-4 md:p-6 rounded-2xl"
                key={idx}
              >
                <div className="flex mb-4 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 text-warning  ${
                        i <= testimonial.stars - 1
                          ? "fill-current"
                          : "fill-white/10"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">
                  {testimonial.message}
                </p>
                <div className="font-semibold text-foreground">
                  {testimonial.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.desg}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-foreground/70 text-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-xl mb-8 leading-relaxed text-background/50">
            Join thousands of educators using SmartQuiz to create engaging,
            effective assessments. Start creating your first quiz in minutes.
          </p>
          <Button
            className="h-[50px] min-w-[300px] p-4 rounded-lg md:rounded-xl text-lg font-semibold bg-background hover:bg-background/90"
            asChild
          >
            <LoginButton>
              Start Creating Quizzes <ArrowRight />
            </LoginButton>
          </Button>
        </div>
      </section>
    </div>
  );
}
