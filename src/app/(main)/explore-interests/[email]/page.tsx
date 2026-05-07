import ExploreDashboard from "@/components/page-sections/explore/ExploreDashboard";
import Container from "@/components/globals/Container";

export default async function ExploreInterestsPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email } = await params;
  const decodedEmail = decodeURIComponent(email);

  return (
    <Container className="py-10 flex-grow flex flex-col">
      <ExploreDashboard email={decodedEmail} />
    </Container>
  );
}
