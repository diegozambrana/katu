import { AdminOnly } from "@/components/AdminOnly";
import { SupportMessages } from "@/features/support/messages/SupportMessages";
import { getSupportMessages } from "@/actions/support/SupportActions";

export default async function SupportMessagesPage() {
  const messages = await getSupportMessages();
  return (
    <AdminOnly>
      <SupportMessages initialMessages={messages || []} />
    </AdminOnly>
  );
}