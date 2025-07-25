import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const newsItems = [
  {
    id: 1,
    title: "New Scholarship Program Announced",
    excerpt:
      "We are excited to launch a new scholarship program for the upcoming academic year. Applications are now open.",
    date: "2025-06-15",
    imageUrl: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Annual Sports Day Highlights",
    excerpt:
      "Our annual sports day was a huge success, with students participating in various events and showcasing incredible talent.",
    date: "2025-06-10",
    imageUrl: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Parent-Teacher Meetings Schedule",
    excerpt:
      "The schedule for the upcoming parent-teacher meetings has been released. Please check the portal for your schedule.",
    date: "2025-06-05",
    imageUrl: "/placeholder.svg",
  },
];

const News = () => {
  return (
    <div
      className="min-h-screen bg-gradient-radial from-slate-50 to-white dark:from-slate-900 dark:to-black p-6 sm:p-8 md:p-12"
      data-oid="uqganrf"
    >
      <div className="max-w-7xl mx-auto" data-oid="4rqmhcp">
        <div className="mb-12 text-center animate-fade-in" data-oid="t1vlkp:">
          <h1
            className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-800 bg-clip-text text-transparent dark:from-emerald-400 dark:via-emerald-300 dark:to-green-400"
            data-oid="-l1e1i6"
          >
            Latest News & Updates
          </h1>
          <p
            className="text-xl text-slate-600 dark:text-slate-400"
            data-oid="mdf:x._"
          >
            Stay informed with the latest happenings.
          </p>
        </div>

        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          data-oid="w-__f4-"
        >
          {newsItems.map((item, index) => (
            <Card
              key={item.id}
              className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border border-emerald-200/80 dark:border-emerald-900/80 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.03] hover:border-emerald-400 dark:hover:border-emerald-600 flex flex-col group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              data-oid="wep:q:i"
            >
              <div className="overflow-hidden" data-oid="7dn8p81">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-56 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  data-oid="i9fjjls"
                />
              </div>
              <CardHeader className="p-6" data-oid="r9v88_i">
                <CardTitle
                  className="text-xl font-bold text-emerald-800 dark:text-emerald-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-200 transition-colors"
                  data-oid="gt:dl23"
                >
                  {item.title}
                </CardTitle>
                <p
                  className="text-sm text-slate-500 dark:text-slate-400 pt-1"
                  data-oid="-v60x-b"
                >
                  {item.date}
                </p>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex-grow" data-oid="slf5s-p">
                <p
                  className="text-slate-600 dark:text-slate-400"
                  data-oid="-_nxsi2"
                >
                  {item.excerpt}
                </p>
              </CardContent>
              <div className="p-6 pt-0 mt-auto" data-oid="p.s38-5">
                <Button
                  variant="outline"
                  className="w-full font-semibold border-2 border-emerald-700 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400 hover:bg-emerald-700 hover:text-white dark:hover:bg-emerald-400 dark:hover:text-slate-900 transition-colors duration-300"
                  data-oid="zpw00p."
                >
                  Read More
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
