import { redirect } from "next/navigation";
import { ApplicationWizard } from "@/components/portal/application-wizard";
import { getMyApplication, getCoursesForApplication } from "@/lib/actions/application";
import { getApplicationFee } from "@/lib/paymongo";

export const dynamic = "force-dynamic";

export default async function ApplyPage() {
  const [application, courses] = await Promise.all([getMyApplication(), getCoursesForApplication()]);

  // A submitted application cannot be edited; send the student to the tracker.
  if (application && application.status !== "DRAFT") {
    redirect("/portal/dashboard");
  }

  return (
    <ApplicationWizard
      initialApplication={application}
      courses={courses}
      fee={getApplicationFee()}
    />
  );
}
