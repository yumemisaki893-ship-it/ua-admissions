import {
  registerSchema,
  loginSchema,
  personalInfoSchema,
  uploadSchema,
  contactSchema,
} from "@/lib/validations";

describe("registerSchema", () => {
  it("accepts a valid registration", () => {
    const result = registerSchema.safeParse({
      name: "Juan Dela Cruz",
      email: "juan@example.com",
      password: "StrongPass1",
      confirmPassword: "StrongPass1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects weak passwords", () => {
    const result = registerSchema.safeParse({
      name: "Juan Dela Cruz",
      email: "juan@example.com",
      password: "weakpass",
      confirmPassword: "weakpass",
    });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      name: "Juan Dela Cruz",
      email: "juan@example.com",
      password: "StrongPass1",
      confirmPassword: "Different1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("confirmPassword");
    }
  });
});

describe("loginSchema", () => {
  it("rejects invalid emails", () => {
    expect(loginSchema.safeParse({ email: "not-an-email", password: "x" }).success).toBe(false);
  });

  it("requires a password", () => {
    expect(loginSchema.safeParse({ email: "juan@example.com", password: "" }).success).toBe(false);
  });
});

describe("personalInfoSchema", () => {
  const base = {
    firstName: "Juan",
    lastName: "Dela Cruz",
    gender: "MALE",
    birthDate: "2006-01-01",
    address: "123 Rizal St.",
    city: "Sibalom",
    province: "Antique",
    contactNumber: "09171234567",
    guardianName: "Maria Dela Cruz",
  };

  it("accepts a complete valid profile", () => {
    expect(personalInfoSchema.safeParse(base).success).toBe(true);
  });

  it("rejects invalid Philippine mobile numbers", () => {
    const result = personalInfoSchema.safeParse({ ...base, contactNumber: "12345" });
    expect(result.success).toBe(false);
  });

  it("rejects missing first name", () => {
    const result = personalInfoSchema.safeParse({ ...base, firstName: "" });
    expect(result.success).toBe(false);
  });
});

describe("uploadSchema", () => {
  it("accepts a 5MB PDF", () => {
    const result = uploadSchema.safeParse({
      fileName: "birth-certificate.pdf",
      mimeType: "application/pdf",
      sizeBytes: 5 * 1024 * 1024,
    });
    expect(result.success).toBe(true);
  });

  it("rejects files larger than 5MB", () => {
    const result = uploadSchema.safeParse({
      fileName: "photo.png",
      mimeType: "image/png",
      sizeBytes: 5 * 1024 * 1024 + 1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects disallowed mime types", () => {
    const result = uploadSchema.safeParse({
      fileName: "malware.exe",
      mimeType: "application/x-msdownload",
      sizeBytes: 1000,
    });
    expect(result.success).toBe(false);
  });
});

describe("contactSchema", () => {
  it("accepts a valid message", () => {
    const result = contactSchema.safeParse({
      name: "Juan Dela Cruz",
      email: "juan@example.com",
      subject: "Admission inquiry",
      message: "I would like to know more about the BSIT program.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short messages", () => {
    const result = contactSchema.safeParse({
      name: "Juan",
      email: "juan@example.com",
      subject: "Hi",
      message: "Too short",
    });
    expect(result.success).toBe(false);
  });
});
