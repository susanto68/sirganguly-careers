const WHATSAPP_NUMBER = "919835379900";
const DEFAULT_MESSAGE = "Hi, I have a question about a job listing";

export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/40 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:bottom-6 sm:right-6"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 motion-safe:animate-ping group-hover:animate-none" />
      <svg
        viewBox="0 0 32 32"
        className="relative h-8 w-8 fill-white"
        aria-hidden="true"
      >
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.317.655 4.482 1.79 6.324L4 29l7.86-1.75A11.95 11.95 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.75a9.7 9.7 0 0 1-4.947-1.357l-.355-.21-4.66 1.037 1.02-4.57-.232-.365A9.68 9.68 0 0 1 5.25 15c0-5.93 4.82-10.75 10.754-10.75S26.75 9.07 26.75 15 21.938 24.75 16.004 24.75Zm5.46-7.36c-.298-.15-1.76-.868-2.033-.967-.273-.1-.472-.15-.67.15-.198.298-.767.966-.94 1.164-.174.198-.348.223-.646.075-.298-.15-1.257-.463-2.394-1.475-.885-.789-1.483-1.763-1.657-2.062-.174-.298-.019-.46.13-.609.134-.133.298-.348.447-.522.15-.174.198-.298.298-.497.1-.198.05-.372-.025-.522-.075-.15-.67-1.614-.918-2.211-.242-.582-.487-.503-.67-.512l-.57-.01c-.198 0-.522.075-.795.372-.273.298-1.04 1.017-1.04 2.48s1.065 2.877 1.213 3.075c.15.198 2.096 3.2 5.078 4.487.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.76-.72 2.008-1.415.248-.695.248-1.29.174-1.415-.075-.124-.273-.198-.571-.348Z" />
      </svg>
    </a>
  );
}
