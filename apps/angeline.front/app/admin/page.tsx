import CreateCategory from "./createCategory";
import Listing from "./listing";
import { AdminPageHeader } from "./adminUi";

export default function Admin() {
  return (
    <>
      <AdminPageHeader
        title="Reportages"
        description="Gérez les contenus et leur visibilité sur votre portfolio."
        action={<CreateCategory />}
      />
      <Listing />
    </>
  );
}
