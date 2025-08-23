export const toWhatsAppHref = (phone: string) =>
  `https://wa.me/${phone.replace(/\D/g, "")}`;
