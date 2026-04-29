import ExploreDashboard from "@/components/page-sections/explore/ExploreDashboard";

export default function ExploreInterestsPage({
  params,
}: {
  params: { email: string };
}) {
  const decodedEmail = decodeURIComponent(params.email);

  return (
    <div className=" container mx-auto w-full px-4 py-10 flex-grow flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          Your Discovered Interests
        </h1>
        <p className="text-foreground/60 mt-2">
          Curated results for{" "}
          <span className="font-semibold text-primary">{decodedEmail}</span>
        </p>
      </div>

      <ExploreDashboard email={decodedEmail} />
    </div>
  );
}
