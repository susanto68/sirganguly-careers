export type Company = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  careerUrl: string;
  domain: string;
  verified: boolean;
  category: "Government" | "Private" | "Startup" | "International";
  description: string;
  headquarters: string;
};
