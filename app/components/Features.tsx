import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface featuresData {
  title: string;
  descrption: string;
}

export function Features() {
  let data: featuresData[] = [
    {
      title: "Effortless Expense Tracking",
      descrption:
        "Our intuitive interface makes it a breeze to add, edit, and delete expenses. Record transactions on the go with just a few taps or clicks. Organize your expenses into custom categories that perfectly suit your lifestyle.",
    },
    {
      title: "Real-Time Insights",
      descrption:
        "Gain a clear understanding of your spending habits with our visually appealing graphs and charts. Track your progress towards budget goals and identify areas for improvement.",
    },
    {
      title: "Smart Budgeting",
      descrption:
        "Create and customize budgets for different categories to align with your financial needs. Receive timely notifications when you're approaching or exceeding your budget limits. Set savings goals and watch your progress grow.",
    },
    {
      title: "Automated Features",
      descrption:
        "Simplify your financial life with our automated features. Automatically track recurring expenses like rent and utilities. Set reminders for important financial deadlines to stay organized.",
    },
    {
      title: "Security and Privacy",
      descrption:
        "Your financial data is our top priority. We use advanced encryption to protect your information from unauthorized access. Enjoy peace of mind knowing that your data is safe and secure.",
    },
    {
      title: "Customizable Experience",
      descrption:
        "Personalize your app to match your style with a variety of themes. Add a convenient widget to your home screen for quick access to your financial data.",
    },
  ];
  return (
    <section className="features w-full font-semibold ">
      <h2 className="w-full text-center text-5xl my-7">Features</h2>
      <div className="w-11/12 md:w-5/6 mx-auto md:grid md:grid-cols-2 md:grid-rows-3 gap-3 flex flex-col ">
        {data.map((card, i) => (
          <Card key={i} className="cards">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.descrption}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
