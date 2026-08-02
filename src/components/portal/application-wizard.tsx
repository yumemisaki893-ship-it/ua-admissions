"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck2,
  FileText,
  GraduationCap,
  Info,
  Loader2,
  PartyPopper,
  RefreshCw,
  Upload,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatBytes } from "@/lib/utils";
import { personalInfoSchema, type PersonalInfoInput } from "@/lib/validations";
import {
  savePersonalInfo,
  saveCourseSelection,
  submitApplication,
  uploadDocument,
} from "@/lib/actions/application";
import { createPaymentCheckout, paymentStatus } from "@/lib/actions/payment";

interface CourseOption {
  id: string;
  code: string;
  name: string;
  durationYears: number;
  college: { id: string; code: string; name: string; sortOrder: number };
}

interface WizardApplication {
  id: string;
  status: string;
  courseId: string;
  applicationFeePaid: boolean;
  referenceNumber: string | null;
  paymongoCheckoutId: string | null;
  course: CourseOption | null;
  studentProfile: {
    firstName: string;
    middleName: string | null;
    lastName: string;
    suffix: string | null;
    birthDate: Date;
    gender: string;
    birthplace: string | null;
    address: string;
    city: string;
    province: string;
    zipCode: string | null;
    contactNumber: string;
    guardianName: string;
    guardianContact: string | null;
  } | null;
  documents: { id: string; type: string; fileName: string; url: string; sizeBytes: number }[];
  payment: { status: string } | null;
}

const STEPS = [
  { label: "Personal Info", icon: UserRound },
  { label: "Course", icon: GraduationCap },
  { label: "Requirements", icon: Upload },
  { label: "Payment", icon: CreditCard },
  { label: "Submit", icon: FileCheck2 },
];

const DOCUMENT_FIELDS: { type: "BIRTH_CERT" | "FORM_137" | "PHOTO"; label: string; hint: string; accept: string }[] = [
  {
    type: "BIRTH_CERT",
    label: "PSA Birth Certificate",
    hint: "PDF, PNG or JPEG · max 5MB",
    accept: ".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg",
  },
  {
    type: "FORM_137",
    label: "Form 137 (High School Records)",
    hint: "Scanned copy from your school",
    accept: ".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg",
  },
  {
    type: "PHOTO",
    label: "2x2 ID Picture",
    hint: "Recent photo, white background",
    accept: ".png,.jpg,.jpeg,image/png,image/jpeg",
  },
];

const MAX_SIZE = 5 * 1024 * 1024;

export function ApplicationWizard({
  initialApplication,
  courses,
  fee,
  admissionOpen,
}: {
  initialApplication: WizardApplication | null;
  courses: CourseOption[];
  fee: number;
  admissionOpen?: boolean;
}) {
  return (
    <React.Suspense fallback={<WizardLoading />}>
      <WizardContent
        initialApplication={initialApplication}
        courses={courses}
        fee={fee}
        admissionOpen={admissionOpen ?? true}
      />
    </React.Suspense>
  );
}

function WizardLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

function WizardContent({
  initialApplication,
  courses,
  fee,
  admissionOpen,
}: {
  initialApplication: WizardApplication | null;
  courses: CourseOption[];
  fee: number;
  admissionOpen: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [step, setStepState] = React.useState(0);
  const [uploading, setUploading] = React.useState<string | null>(null);
  const [paying, setPaying] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [referenceNumber, setReferenceNumber] = React.useState<string | null>(null);
  const [isSimulated, setIsSimulated] = React.useState(false);

  const { data: application } = useQuery({
    queryKey: ["application"],
    queryFn: async () => initialApplication,
    initialData: initialApplication,
  });

  const profileComplete = Boolean(
    application?.studentProfile?.firstName && application.studentProfile.address,
  );
  const courseComplete = Boolean(application?.courseId && application.course);
  const docsComplete = (application?.documents.length ?? 0) >= 3;
  const paid = Boolean(application?.applicationFeePaid);

  // Sync step with URL ?step=N (payment success redirects land on step 5)
  React.useEffect(() => {
    const raw = searchParams.get("step");
    if (raw && !Number.isNaN(Number(raw))) {
      setStepState(Math.min(Math.max(Number(raw) - 1, 0), 4));
    }
    if (searchParams.get("payment") === "success") {
      queryClient.invalidateQueries({ queryKey: ["application"] });
      toast.success("Payment received", { description: "Your application fee has been verified." });
    }
    if (searchParams.get("payment") === "cancelled") {
      toast.error("Payment cancelled", { description: "You can try paying again anytime." });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function setStep(next: number) {
    setStepState(next);
    router.replace(`/portal/apply?step=${next + 1}`);
  }

  const maxReachable = React.useMemo(() => {
    let m = 0;
    if (profileComplete) m = 1;
    if (profileComplete && courseComplete) m = 2;
    if (profileComplete && courseComplete && docsComplete) m = 3;
    if (profileComplete && courseComplete && docsComplete && paid) m = 4;
    return m;
  }, [profileComplete, courseComplete, docsComplete, paid]);

  const safeStep = Math.min(step, maxReachable);

  if (!admissionOpen && !application) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-amber-400/50 bg-yellow-500/10 p-10 text-center shadow-sm">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-crimson-700 text-white">
            <Clock className="h-8 w-8" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold text-white sm:text-3xl">
            Applications are currently closed
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-300">
            The Office of Admissions is not accepting new applications at this time. Please check
            back when the next admission period opens.
          </p>
          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href="/portal/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  async function refreshApplication() {
    await queryClient.invalidateQueries({ queryKey: ["application"] });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
          Online Application
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete all five steps to submit your application. Your progress is saved automatically.
        </p>
      </div>

      {!admissionOpen && (
        <div className="flex items-start gap-2.5 rounded-lg border border-amber-400/50 bg-yellow-500/10 p-3.5 text-xs text-yellow-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Admission is currently closed for new applicants. You may still continue and submit
            your in-progress application, which will be reviewed by the Admissions Office.
          </p>
        </div>
      )}

      {/* Stepper */}
      <div>
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const done = i < safeStep || (i === safeStep && (i === 0 ? profileComplete : i === 1 ? courseComplete : i === 2 ? docsComplete : i === 3 ? paid : false));
            const active = i === safeStep;
            return (
              <React.Fragment key={s.label}>
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                      done
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : active
                          ? "border-crimson-700 bg-crimson-700 text-white"
                          : "border-muted-foreground/30 text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                  </span>
                  <span className={cn("hidden text-[11px] font-medium sm:block", active ? "text-crimson-300" : "text-muted-foreground")}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="h-0.5 flex-1 rounded bg-muted">
                    <div className={cn("h-full rounded bg-emerald-500 transition-all", i < safeStep ? "w-full" : "w-0")} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <Progress value={((safeStep + 1) / 5) * 100} className="mt-4 sm:hidden" />
      </div>

      {referenceNumber ? (
        <SuccessScreen referenceNumber={referenceNumber} />
      ) : (
        <>
          {/* STEP 1 — Personal info */}
          {safeStep === 0 && (
            <PersonalInfoStep
              key={application?.studentProfile?.firstName ?? "empty"}
              initial={application?.studentProfile}
              onSaved={() => {
                refreshApplication();
                setStep(1);
              }}
            />
          )}

          {/* STEP 2 — Course */}
          {safeStep === 1 && (
            <CourseStep
              courses={courses}
              selectedCourseId={application?.courseId ?? ""}
              onSaved={() => {
                refreshApplication();
                setStep(2);
              }}
            />
          )}

          {/* STEP 3 — Uploads */}
          {safeStep === 2 && (
            <UploadStep
              documents={application?.documents ?? []}
              uploading={uploading}
              onContinue={() => setStep(3)}
              onUpload={async (type, file) => {
                setUploading(type);
                try {
                  const dataUrl = await readFileAsDataURL(file);
                  const result = await uploadDocument({
                    type,
                    fileName: file.name,
                    mimeType: file.type,
                    dataUrl,
                  });
                  if (result.error) {
                    toast.error("Upload failed", { description: result.error });
                  } else {
                    toast.success("Document uploaded", { description: `${file.name} uploaded successfully.` });
                    await refreshApplication();
                  }
                } catch {
                  toast.error("Upload failed", { description: "Could not read the selected file." });
                } finally {
                  setUploading(null);
                }
              }}
            />
          )}

          {/* STEP 4 — Payment */}
          {safeStep === 3 && (
            <PaymentStep
              fee={fee}
              simulated={isSimulated}
              paying={paying}
              onPay={async () => {
                setPaying(true);
                const result = await createPaymentCheckout();
                setPaying(false);
                if (!result.ok) {
                  toast.error("Payment failed", { description: result.error });
                  return;
                }
                setIsSimulated(result.simulated);
                toast.info(result.simulated ? "Payment simulation" : "Checkout created", {
                  description: result.simulated
                    ? "You are using the development payment simulator."
                    : "Complete your payment in the checkout window.",
                });
                router.push(result.checkoutUrl);
              }}
              onCheckStatus={async () => {
                const result = await paymentStatus();
                if (result.paid) {
                  await refreshApplication();
                  toast.success("Payment verified");
                } else {
                  toast.info("Not yet paid", { description: "We have not received your payment yet." });
                }
              }}
            />
          )}

          {/* STEP 5 — Review & submit */}
          {safeStep === 4 && (
            <ReviewStep
              application={application}
              fee={fee}
              submitting={submitting}
              onSubmit={async () => {
                setSubmitting(true);
                const result = await submitApplication();
                setSubmitting(false);
                if (result.error) {
                  toast.error("Could not submit", { description: result.error });
                  return;
                }
                setReferenceNumber(result.referenceNumber ?? null);
                toast.success("Application submitted!");
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// STEP 1
// ---------------------------------------------------------------------------
function PersonalInfoStep({
  initial,
  onSaved,
}: {
  initial?: WizardApplication["studentProfile"] | null;
  onSaved: () => void;
}) {
  const [saving, setSaving] = React.useState(false);

  const form = useForm<PersonalInfoInput>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: initial?.firstName ?? "",
      middleName: initial?.middleName ?? "",
      lastName: initial?.lastName ?? "",
      suffix: initial?.suffix ?? "",
      gender: (initial?.gender as "MALE" | "FEMALE") ?? undefined,
      birthDate: initial?.birthDate ? new Date(initial.birthDate).toISOString().slice(0, 10) : "",
      birthplace: initial?.birthplace ?? "",
      address: initial?.address ?? "",
      city: initial?.city ?? "",
      province: initial?.province ?? "",
      zipCode: initial?.zipCode ?? "",
      contactNumber: initial?.contactNumber ?? "",
      guardianName: initial?.guardianName ?? "",
      guardianContact: initial?.guardianContact ?? "",
    },
  });

  async function onSubmit(values: PersonalInfoInput) {
    setSaving(true);
    const result = await savePersonalInfo(values);
    setSaving(false);
    if (result.error) {
      toast.error("Could not save", { description: result.error });
      return;
    }
    toast.success("Personal information saved");
    onSaved();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Personal Information</CardTitle>
        <CardDescription>
          Use the name exactly as it appears on your PSA birth certificate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="middleName" render={({ field }) => (
                <FormItem><FormLabel>Middle Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="lastName" render={({ field }) => (
                <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="suffix" render={({ field }) => (
                <FormItem><FormLabel>Suffix</FormLabel><FormControl><Input placeholder="Jr., Sr., III" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="birthDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Date</FormLabel>
                  <FormControl><Input type="date" max={new Date().toISOString().slice(0, 10)} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="birthplace" render={({ field }) => (
                <FormItem><FormLabel>Place of Birth</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel>Complete Address</FormLabel>
                <FormControl><Input placeholder="House no., Street, Barangay" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem><FormLabel>City / Municipality</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="province" render={({ field }) => (
                <FormItem><FormLabel>Province</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="zipCode" render={({ field }) => (
                <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="contactNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl><Input placeholder="09XX XXX XXXX" inputMode="tel" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="guardianContact" render={({ field }) => (
                <FormItem><FormLabel>Guardian Contact (optional)</FormLabel><FormControl><Input placeholder="09XX XXX XXXX" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <FormField control={form.control} name="guardianName" render={({ field }) => (
              <FormItem>
                <FormLabel>Parent / Guardian Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormDescription>The guardian we may contact for admission matters.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save & Continue <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// STEP 2
// ---------------------------------------------------------------------------
function CourseStep({
  courses,
  selectedCourseId,
  onSaved,
}: {
  courses: CourseOption[];
  selectedCourseId: string;
  onSaved: () => void;
}) {
  const [selected, setSelected] = React.useState(selectedCourseId);
  const [saving, setSaving] = React.useState(false);

  const colleges = React.useMemo(() => {
    const map = new Map<string, { code: string; name: string; courses: CourseOption[] }>();
    for (const c of courses) {
      const group = map.get(c.college.id) ?? { code: c.college.code, name: c.college.name, courses: [] };
      group.courses.push(c);
      map.set(c.college.id, group);
    }
    return [...map.entries()].sort((a, b) => a[1].code.localeCompare(b[1].code));
  }, [courses]);

  async function handleSave() {
    if (!selected) {
      toast.error("Select a course", { description: "Please choose a program to continue." });
      return;
    }
    setSaving(true);
    const result = await saveCourseSelection({ courseId: selected });
    setSaving(false);
    if (result.error) {
      toast.error("Could not save", { description: result.error });
      return;
    }
    toast.success("Course selected");
    onSaved();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Select Your Course</CardTitle>
        <CardDescription>Choose the degree program you are applying for.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {colleges.map(([collegeId, college]) => (
          <fieldset key={collegeId}>
            <legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <span className="rounded bg-crimson-900 px-2 py-0.5 font-mono text-[11px] font-semibold text-yellow-300">
                {college.code}
              </span>
              {college.name}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {college.courses.map((course) => (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => setSelected(course.id)}
                  className={cn(
                    "flex items-start justify-between gap-3 rounded-lg border p-4 text-left transition-colors",
                    selected === course.id
                      ? "border-crimson-400/60 bg-crimson-500/15 ring-1 ring-crimson-400/30"
                      : "hover:border-amber-400/60",
                  )}
                  aria-pressed={selected === course.id}
                >
                  <div>
                    <p className="font-mono text-xs font-semibold text-crimson-300">{course.code}</p>
                    <p className="mt-1 text-sm font-medium text-white">{course.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{course.durationYears} years</p>
                  </div>
                  {selected === course.id && <CheckCircle2 className="h-5 w-5 shrink-0 text-crimson-300" />}
                </button>
              ))}
            </div>
          </fieldset>
        ))}

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save & Continue <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// STEP 3
// ---------------------------------------------------------------------------
function UploadStep({
  documents,
  uploading,
  onContinue,
  onUpload,
}: {
  documents: WizardApplication["documents"];
  uploading: string | null;
  onContinue: () => void;
  onUpload: (type: "BIRTH_CERT" | "FORM_137" | "PHOTO", file: File) => void;
}) {
  const inputRefs = React.useRef<Record<string, HTMLInputElement | null>>({});

  function handleFile(type: "BIRTH_CERT" | "FORM_137" | "PHOTO", file: File | undefined) {
    if (!file) return;
    const validType = ["application/pdf", "image/png", "image/jpeg"].includes(file.type);
    if (!validType) {
      toast.error("Invalid file type", { description: "Only PDF, PNG, and JPEG files are allowed." });
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("File too large", { description: "Maximum file size is 5 MB." });
      return;
    }
    onUpload(type, file);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upload Requirements</CardTitle>
        <CardDescription>
          {documents.length}/3 uploaded. Each file must be PDF, PNG, or JPEG and no larger than 5 MB.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {DOCUMENT_FIELDS.map((field) => {
          const doc = documents.find((d) => d.type === field.type);
          const isUploading = uploading === field.type;
          return (
            <div key={field.type} className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {doc ? (
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" />
                  ) : (
                    <FileText className="h-6 w-6 shrink-0 text-muted-foreground/60" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{field.label}</p>
                    {doc ? (
                      <p className="text-xs text-muted-foreground">
                        {doc.fileName} · {formatBytes(doc.sizeBytes)} ·{" "}
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-crimson-300 hover:underline">
                          View file
                        </a>
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">{field.hint}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => inputRefs.current[field.type]?.click()}
                      disabled={isUploading}
                    >
                      <RefreshCw className="mr-1 h-3.5 w-3.5" /> Replace
                    </Button>
                  )}
                  <Button
                    variant={doc ? "outline" : "default"}
                    size="sm"
                    onClick={() => inputRefs.current[field.type]?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="mr-1 h-4 w-4" />}
                    {doc ? "Re-upload" : "Upload"}
                  </Button>
                  <input
                    ref={(el) => {
                      inputRefs.current[field.type] = el;
                    }}
                    type="file"
                    accept={field.accept}
                    className="hidden"
                    onChange={(e) => handleFile(field.type, e.target.files?.[0])}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex items-start gap-2.5 rounded-lg border border-amber-400/40 bg-yellow-500/10 p-3.5 text-xs text-yellow-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Make sure scanned copies are <strong>clear and legible</strong>. Blurry or incomplete documents may
            delay the evaluation of your application.
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={onContinue} disabled={documents.length < 3}>
            Continue <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// STEP 4
// ---------------------------------------------------------------------------
function PaymentStep({
  fee,
  simulated,
  paying,
  onPay,
  onCheckStatus,
}: {
  fee: number;
  simulated: boolean;
  paying: boolean;
  onPay: () => void;
  onCheckStatus: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Application Fee Payment</CardTitle>
        <CardDescription>
          The application fee is non-refundable and covers processing and evaluation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl bg-gradient-to-br from-crimson-700 to-crimson-900 p-6 text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">Application Fee</p>
          <p className="mt-2 font-display text-4xl font-semibold">PHP {fee.toLocaleString()}</p>
          <p className="mt-1 text-sm text-red-100">Paid securely via PayMongo</p>
        </div>

        {simulated && (
          <div className="flex items-start gap-2.5 rounded-lg border border-amber-400/50 bg-amber-500/10 p-3.5 text-xs text-amber-200">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              <strong>Development mode:</strong> PayMongo is not configured, so the payment is simulated. The
              simulated checkout will mark your fee as paid automatically.
            </p>
          </div>
        )}

        <div className="space-y-2.5 text-sm">
          {["GCash", "Maya", "Credit / Debit Card"].map((method) => (
            <div key={method} className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
              <span className="font-medium text-white">{method}</span>
              <Badge variant="success">Available</Badge>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={onPay} disabled={paying} className="flex-1" size="lg">
            {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="mr-1 h-4 w-4" />}
            {paying ? "Creating checkout…" : `Pay PHP ${fee.toLocaleString()}`}
          </Button>
          <Button variant="outline" onClick={onCheckStatus} size="lg">
            <RefreshCw className="mr-1 h-4 w-4" /> Check Payment Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// STEP 5
// ---------------------------------------------------------------------------
function ReviewStep({
  application,
  fee,
  submitting,
  onSubmit,
}: {
  application: WizardApplication | null;
  fee: number;
  submitting: boolean;
  onSubmit: () => void;
}) {
  const profile = application?.studentProfile;
  const docLabels: Record<string, string> = {
    BIRTH_CERT: "PSA Birth Certificate",
    FORM_137: "Form 137",
    PHOTO: "2x2 ID Photo",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Review & Submit</CardTitle>
        <CardDescription>Please review your application before submitting.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <UserRound className="h-4 w-4 text-crimson-300" /> Applicant
          </h3>
          <div className="grid gap-x-6 gap-y-1.5 rounded-lg bg-white/[0.05] p-4 text-sm sm:grid-cols-2">
            <p><span className="text-muted-foreground">Name:</span> <strong className="text-white">
              {profile?.firstName} {profile?.middleName ?? ""} {profile?.lastName} {profile?.suffix ?? ""}
            </strong></p>
            <p><span className="text-muted-foreground">Gender:</span> {profile?.gender}</p>
            <p><span className="text-muted-foreground">Birth date:</span> {profile?.birthDate ? new Date(profile.birthDate).toLocaleDateString("en-PH", { dateStyle: "long" }) : "—"}</p>
            <p><span className="text-muted-foreground">Contact:</span> {profile?.contactNumber}</p>
            <p className="sm:col-span-2"><span className="text-muted-foreground">Address:</span> {profile?.address}</p>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <GraduationCap className="h-4 w-4 text-crimson-300" /> Course
          </h3>
          <div className="rounded-lg bg-white/[0.05] p-4 text-sm">
            <p className="font-medium text-white">
              {application?.course?.name} <span className="font-mono text-xs text-crimson-300">({application?.course?.code})</span>
            </p>
            <p className="text-xs text-muted-foreground">{application?.course?.college.name}</p>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <FileText className="h-4 w-4 text-crimson-300" /> Documents
          </h3>
          <ul className="space-y-1.5 rounded-lg bg-white/[0.05] p-4 text-sm">
            {(application?.documents ?? []).map((doc) => (
              <li key={doc.id} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {docLabels[doc.type] ?? doc.type}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{formatBytes(doc.sizeBytes)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <CreditCard className="h-4 w-4 text-crimson-300" /> Payment
          </h3>
          <div className="flex items-center justify-between rounded-lg bg-white/[0.05] p-4 text-sm">
            <span className="text-muted-foreground">Application fee</span>
            <span className="flex items-center gap-2 font-medium text-white">
              PHP {fee.toLocaleString()} <Badge variant="success">Paid</Badge>
            </span>
          </div>
        </section>

        <div className="rounded-lg border border-amber-400/50 bg-amber-500/10 p-4 text-xs text-amber-200">
          By submitting this application, you certify that the information provided is true and correct. Any
          misrepresentation may result in the cancellation of your admission.
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button onClick={onSubmit} disabled={submitting} size="lg">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCheck2 className="mr-1 h-4 w-4" />}
            {submitting ? "Submitting…" : "Submit Application"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Success
// ---------------------------------------------------------------------------
function SuccessScreen({ referenceNumber }: { referenceNumber: string }) {
  return (
    <Card className="border-emerald-500/40">
      <CardContent className="flex flex-col items-center gap-5 p-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <PartyPopper className="h-8 w-8" />
        </span>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-semibold text-white">Application Submitted!</h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            Your application has been received. Save your reference number — you will need it for all future
            correspondence.
          </p>
        </div>
        <div className="rounded-xl border-2 border-dashed border-amber-400/50 bg-yellow-500/10 px-8 py-4">
          <p className="text-xs uppercase tracking-widest text-crimson-300">Reference Number</p>
          <p className="mt-1 font-display text-3xl font-bold tracking-wider text-white">
            {referenceNumber}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/portal/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Website</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
