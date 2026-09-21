import { createClient } from "@/lib/supabase/server";
import EventPopup from "./EventPopup";
import EggplantSpawner from "./EggplantSpawner";

export default async function EventLayer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <>
      <EventPopup isLoggedIn={isLoggedIn} />
      {isLoggedIn && <EggplantSpawner />}
    </>
  );
}
