import { SignUpCard } from "./SignUpCard";
import Image from "next/image";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { JwtPayload } from "jsonwebtoken";

const HomeSection = ({
  userId,
}: {
  userId: undefined | string | JwtPayload;
}) => {
  return (
    <section className="home w-full my-3 md:my-0 ">
      <div className="hero w-11/12 md:w-5/6 mx-auto flex flex-col  md:flex-row min-h-[500px] flex-wrap justify-center items-center">
        <div className="w-full md:w-1/2 my-5 min-h-[400px] md:h-auto flex flex-col justify-center ">
          <div className="1-12 text-5xl font-semibold tagline">
            <div className="">
              <h1>Track Your</h1>
              <h1 className="text-6xl ">Finances,</h1>
            </div>
            <h1>Take Control.</h1>
          </div>
          <hr className="bg-primary h-1 w-80 my-10" />
          <em className="font-semibold text-muted-foreground">
            Streamline your budgeting, effortlessly track expenses, and gain
            valuable insights into your spending habits with our user-friendly
            expense tracker
          </em>
          <div>{userId ? <></> : <SignUpCard />}</div>
        </div>
        <div className="cards flex md:w-1/2 flex-wrap justify-evenly text-center items-center md:min-w-96">
          <div className="w-44 h-[350px] my-5">
            <h3 className="bg-blue-500 text-white font-semibold py-1">
              Budgeting
            </h3>
            <Image
              src="/pie-chart.png"
              alt="pie chart"
              width={150}
              height={150}
              className="mx-auto my-1"
            />
            <em className="text-sm">
              Create personalized budgets to align with your financial goals and
              track your spending against them
            </em>
          </div>
          <div className="w-44 h-[350px] my-5">
            <h3 className="bg-blue-500 text-white font-semibold py-1">
              Tracking
            </h3>
            <Image
              src="/calender.png"
              alt="calender icon"
              width={150}
              height={150}
              className="mx-auto my-1"
            />
            <em className="text-sm font-medium">
              Effortlessly record your expenses, categorize them, and analyze
              your spending patterns.
            </em>
          </div>
          <div className="w-44 h-[350px] my-5">
            <h3 className="bg-blue-500 text-white font-semibold py-1">
              Analytics
            </h3>
            <Image
              src="/bar-chart.png"
              alt="bar chart"
              width={150}
              height={150}
              className="mx-auto my-1"
            />
            <em className="text-sm">
              Generate insightful reports to understand your spending habits,
              identify areas for improvement, and make informed financial
              decisions.
            </em>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
