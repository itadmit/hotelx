import { ScrollToTopOnNav } from "@/components/guest/ScrollToTopOnNav";

/** Guest room routes must always read fresh categories & services from the DB. */
export const dynamic = "force-dynamic";

export default function GuestRoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollToTopOnNav />
      {children}
    </>
  );
}
