import Link from "next/link";

export function Footer() {
  return (
    <section className="footer w-full  mt-7 bg-background">
      <div className=" w-11/12 md:w-5/6 mx-auto text-center flex items-center flex-col">
        <h1 className="text-2xl text-card-foreground py-5">Expense tracker</h1>
        <h3 className="text-muted-foreground md:w-1/2 mx-auto">
          <em>
            Discover the ultimate expense tracking app to manage your finances
            effectively. Track expenses, set budgets, and analyze spending
            patterns.
          </em>
        </h3>
        <div className="flex justify-center w-full flex-wrap py-3">
          <p>@2025 - All rights reserved</p>
        </div>
      </div>
    </section>
  );
}
