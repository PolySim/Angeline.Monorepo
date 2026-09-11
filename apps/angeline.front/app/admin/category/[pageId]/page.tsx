import { Suspense } from "react";
import { AdminLoading } from "../../adminUi";
import UpdateReportContainer from "./updateReportContainer";

export default function CategoryPage() {
  return (
    <Suspense fallback={<AdminLoading label="Chargement du reportage…" />}>
      <UpdateReportContainer />
    </Suspense>
  );
}
