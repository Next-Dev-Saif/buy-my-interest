import ExploreDashboard from "@/components/page-sections/explore/ExploreDashboard";

export default async function ExploreInterestsPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email } = await params;
  const decodedEmail = decodeURIComponent(email);

  return (
    <div className=" container mx-auto w-full px-4 py-10 flex-grow flex flex-col">
      <ExploreDashboard email={decodedEmail} />
    </div>
  );
}
