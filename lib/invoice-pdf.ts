import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type {
  Invoice,
  InvoicePayment,
  PaymentMethod,
  InvoiceType,
} from "@/types/invoice";
import { formatCurrency, formatNumber } from "@/lib/number-utils";
import { locales as supportedLocales } from "@/i18n/routing";

const FONT_NAME = "Roboto";

interface FontVariant {
  vfsName: string;
  style: "normal" | "bold" | "italic" | "bolditalic";
  publicPaths: string[];
}

const FONT_VARIANTS: FontVariant[] = [
  {
    vfsName: "Roboto-Regular.ttf",
    style: "normal",
    publicPaths: ["/fonts/Roboto-font.ttf", "/fonts/static/Roboto-Regular.ttf"],
  },
  {
    vfsName: "Roboto-Bold.ttf",
    style: "bold",
    publicPaths: ["/fonts/static/Roboto-Bold.ttf"],
  },
  {
    vfsName: "Roboto-Italic.ttf",
    style: "italic",
    publicPaths: ["/fonts/static/Roboto-Italic.ttf"],
  },
  {
    vfsName: "Roboto-BoldItalic.ttf",
    style: "bolditalic",
    publicPaths: ["/fonts/static/Roboto-BoldItalic.ttf"],
  },
];

const SUPPORTED_LOCALES_SET = new Set<string>(supportedLocales);

function getLocalePrefixes() {
  if (typeof window === "undefined") {
    return [""];
  }

  const pathSegments = window.location.pathname.split("/").filter(Boolean);
  if (pathSegments.length === 0) {
    return [""];
  }

  const maybeLocale = pathSegments[0];
  if (SUPPORTED_LOCALES_SET.has(maybeLocale)) {
    return ["", `/${maybeLocale}`];
  }

  return [""];
}

function getFontPaths(publicPaths: string[]) {
  const prefixes = getLocalePrefixes();
  const uniquePaths = new Set<string>();

  for (const basePath of publicPaths) {
    for (const prefix of prefixes) {
      uniquePaths.add(`${prefix}${basePath}`);
    }
  }

  return Array.from(uniquePaths);
}

function buildAbsoluteUrl(path: string) {
  if (typeof window !== "undefined" && window.location) {
    return `${window.location.origin}${path}`;
  }
  return path;
}

const fontDataCache: Record<string, Promise<string>> = {};

function decodeToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

async function loadFontData(variant: FontVariant): Promise<string> {
  if (!fontDataCache[variant.vfsName]) {
    fontDataCache[variant.vfsName] = (async () => {
      const candidatePaths = getFontPaths(variant.publicPaths);

      for (const path of candidatePaths) {
        const url = buildAbsoluteUrl(path);
        try {
          const response = await fetch(url, { cache: "force-cache" });
          if (response.ok) {
            const buffer = await response.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            return decodeToBase64(bytes);
          }
          console.warn(
            `Roboto font not found at ${url} (status: ${response.status})`
          );
        } catch (error) {
          console.warn(`Failed to fetch Roboto font from ${url}`, error);
        }
      }

      throw new Error(
        `Nie udało się pobrać czcionki Roboto (${variant.vfsName}) z żadnej lokalizacji. Upewnij się, że plik znajduje się w katalogu public/fonts/.`
      );
    })().catch((error) => {
      delete fontDataCache[variant.vfsName];
      throw error;
    });
  }

  return fontDataCache[variant.vfsName];
}

async function registerFonts(doc: jsPDF): Promise<string> {
  try {
    await Promise.all(
      FONT_VARIANTS.map(async (variant) => {
        const base64 = await loadFontData(variant);
        doc.addFileToVFS(variant.vfsName, base64);
        doc.addFont(variant.vfsName, FONT_NAME, variant.style);
      })
    );
    doc.setFont(FONT_NAME, "normal");
    return FONT_NAME;
  } catch (error) {
    console.error(
      "Failed to load Roboto font for PDF. Falling back to Helvetica.",
      error
    );
    doc.setFont("helvetica", "normal");
    return "helvetica";
  }
}

interface TableRow {
  description: string;
  pkwiu: string;
  quantity: string;
  unit: string;
  unitNetPrice: string;
  vatRate: string;
  netAmount: string;
  vatAmount: string;
  grossAmount: string;
}

const PAGE_MARGIN = 40;

const paymentMethodLabels: Record<PaymentMethod, string> = {
  TRANSFER: "Przelew bankowy",
  CASH: "Gotówka",
  CARD: "Płatność kartą",
  OTHER: "Inna metoda",
};

const invoiceTypeLabels: Record<InvoiceType, string> = {
  VAT: "Faktura VAT",
  PROFORMA: "Faktura proforma",
  CORRECTION: "Faktura korygująca",
  RECEIPT: "Paragon",
};

function formatAddress(snapshot?: {
  address?: string;
  postalCode?: string;
  city?: string;
}) {
  if (!snapshot) return "";
  const parts = [
    snapshot.address,
    [snapshot.postalCode, snapshot.city].filter(Boolean).join(" "),
  ].filter(Boolean);
  return parts.join("\n");
}

function getCompanyBlock(
  title: string,
  snapshot?: {
    name?: string;
    nip?: string;
    regon?: string;
    address?: string;
    postalCode?: string;
    city?: string;
    email?: string;
    phone?: string;
  }
) {
  if (!snapshot) {
    return `${title}\n—`;
  }

  const lines = [
    title,
    snapshot.name || "—",
    snapshot.nip ? `NIP: ${snapshot.nip}` : undefined,
    snapshot.regon ? `REGON: ${snapshot.regon}` : undefined,
    formatAddress(snapshot),
    snapshot.email ? `Email: ${snapshot.email}` : undefined,
    snapshot.phone ? `Telefon: ${snapshot.phone}` : undefined,
  ].filter(Boolean) as string[];

  return lines.join("\n");
}

function buildItemsTable(invoice: Invoice): TableRow[] {
  return (invoice.items || []).map((item) => ({
    description: item.description,
    pkwiu: item.pkwiuCode || "—",
    quantity: formatNumber(item.quantity, 2),
    unit: item.unit,
    unitNetPrice: formatNumber(item.unitNetPrice, 2),
    vatRate: item.vatExemptionReason
      ? item.vatExemptionReason
      : `${formatNumber(item.vatRate, 0)}%`,
    netAmount: formatNumber(item.netAmount, 2),
    vatAmount: formatNumber(item.vatAmount, 2),
    grossAmount: formatNumber(item.grossAmount, 2),
  }));
}

function buildPaymentsTable(payments: InvoicePayment[] = [], currency: string) {
  return payments.map((payment) => [
    new Date(payment.paymentDate).toLocaleDateString("pl-PL"),
    formatCurrency(payment.amount, currency),
    paymentMethodLabels[payment.method],
    payment.transactionReference || "—",
  ]);
}

function getLastAutoTableFinalY(doc: jsPDF): number | null {
  const lastTable = (doc as unknown as { lastAutoTable?: { finalY: number } })
    .lastAutoTable;
  return lastTable ? lastTable.finalY : null;
}

export async function generateInvoicePdf(invoice: Invoice): Promise<Blob> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const activeFont = await registerFonts(doc);

  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(18);
  doc.text(
    invoiceTypeLabels[invoice.type] || "Faktura",
    PAGE_MARGIN,
    PAGE_MARGIN
  );
  doc.setFontSize(14);
  doc.text(invoice.invoiceNumber, PAGE_MARGIN, PAGE_MARGIN + 20);

  doc.setFontSize(11);
  doc.text(
    `Data wystawienia: ${new Date(invoice.issueDate).toLocaleDateString(
      "pl-PL"
    )}`,
    PAGE_MARGIN,
    PAGE_MARGIN + 40
  );
  doc.text(
    `Data sprzedaży: ${new Date(invoice.saleDate).toLocaleDateString("pl-PL")}`,
    PAGE_MARGIN,
    PAGE_MARGIN + 55
  );
  doc.text(
    `Termin płatności: ${new Date(invoice.dueDate).toLocaleDateString(
      "pl-PL"
    )}`,
    PAGE_MARGIN,
    PAGE_MARGIN + 70
  );
  const paymentMethodLabel =
    paymentMethodLabels[invoice.paymentMethod] || invoice.paymentMethod;
  doc.text(
    `Metoda płatności: ${paymentMethodLabel}`,
    PAGE_MARGIN,
    PAGE_MARGIN + 85
  );
  doc.text(`Waluta: ${invoice.currency}`, PAGE_MARGIN, PAGE_MARGIN + 100);

  // Seller / Buyer columns
  const sellerBlock = getCompanyBlock("Sprzedawca", invoice.sellerSnapshot);
  const buyerBlock = getCompanyBlock("Nabywca", invoice.buyerSnapshot);

  const columnWidth = (pageWidth - PAGE_MARGIN * 2) / 2 - 10;
  doc.setFontSize(12);
  doc.text(
    doc.splitTextToSize(sellerBlock, columnWidth),
    PAGE_MARGIN,
    PAGE_MARGIN + 130
  );
  doc.text(
    doc.splitTextToSize(buyerBlock, columnWidth),
    PAGE_MARGIN + columnWidth + 20,
    PAGE_MARGIN + 130
  );

  // Items table
  const itemsTable = buildItemsTable(invoice);
  autoTable(doc, {
    startY: PAGE_MARGIN + 220,
    head: [
      [
        "Opis",
        "PKWiU",
        "Ilość",
        "J.m.",
        "Cena netto",
        "VAT",
        "Netto",
        "VAT",
        "Brutto",
      ],
    ],
    body: itemsTable.map((row) => [
      row.description,
      row.pkwiu,
      row.quantity,
      row.unit,
      row.unitNetPrice,
      row.vatRate,
      row.netAmount,
      row.vatAmount,
      row.grossAmount,
    ]),
    styles: { font: activeFont, fontSize: 9 },
    headStyles: {
      fillColor: [33, 37, 41],
      font: activeFont,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 60 },
      2: { halign: "right" },
      3: { halign: "center" },
      4: { halign: "right" },
      5: { halign: "center" },
      6: { halign: "right" },
      7: { halign: "right" },
      8: { halign: "right" },
    },
  });

  const lastItemsTableY = getLastAutoTableFinalY(doc);
  let currentY =
    (lastItemsTableY !== null ? lastItemsTableY : PAGE_MARGIN + 220) + 20;

  // Totals
  doc.setFontSize(12);
  doc.text("Podsumowanie", PAGE_MARGIN, currentY);
  doc.setFontSize(11);
  doc.text(
    `Suma netto: ${formatCurrency(invoice.totalNet, invoice.currency)}`,
    PAGE_MARGIN,
    currentY + 18
  );
  doc.text(
    `Suma VAT: ${formatCurrency(invoice.totalVat, invoice.currency)}`,
    PAGE_MARGIN,
    currentY + 36
  );
  doc.text(
    `Suma brutto: ${formatCurrency(invoice.totalGross, invoice.currency)}`,
    PAGE_MARGIN,
    currentY + 54
  );

  if (invoice.totalGrossPln && invoice.currency !== "PLN") {
    doc.text(
      `Suma brutto (PLN): ${formatCurrency(invoice.totalGrossPln, "PLN")}`,
      PAGE_MARGIN,
      currentY + 72
    );
  }

  currentY += 100;

  // Tax summaries
  if (invoice.taxSummaries && invoice.taxSummaries.length > 0) {
    doc.setFontSize(12);
    doc.text("Podsumowanie VAT", PAGE_MARGIN, currentY);
    autoTable(doc, {
      startY: currentY + 10,
      head: [["Stawka VAT", "Netto", "VAT", "Brutto"]],
      body: invoice.taxSummaries.map((summary) => [
        `${formatNumber(summary.vatRate, 0)}%`,
        formatCurrency(summary.netAmount, invoice.currency),
        formatCurrency(summary.vatAmount, invoice.currency),
        formatCurrency(summary.grossAmount, invoice.currency),
      ]),
      styles: { font: activeFont, fontSize: 9 },
      headStyles: {
        fillColor: [33, 37, 41],
        font: activeFont,
        fontStyle: "bold",
      },
    });
    const lastTaxTableY = getLastAutoTableFinalY(doc);
    currentY = (lastTaxTableY !== null ? lastTaxTableY : currentY) + 20;
  }

  // Payments
  if (invoice.payments && invoice.payments.length > 0) {
    doc.setFontSize(12);
    doc.text("Płatności", PAGE_MARGIN, currentY);
    autoTable(doc, {
      startY: currentY + 10,
      head: [["Data", "Kwota", "Metoda", "Referencja"]],
      body: buildPaymentsTable(invoice.payments, invoice.currency),
      styles: { font: activeFont, fontSize: 9 },
      headStyles: {
        fillColor: [33, 37, 41],
        font: activeFont,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { halign: "right" },
        2: { cellWidth: 100 },
        3: { cellWidth: 120 },
      },
    });
    const lastPaymentsTableY = getLastAutoTableFinalY(doc);
    currentY =
      (lastPaymentsTableY !== null ? lastPaymentsTableY : currentY) + 20;

    doc.text(
      `Razem zapłacono: ${formatCurrency(
        invoice.totalPaid || 0,
        invoice.currency
      )}`,
      PAGE_MARGIN,
      currentY
    );
    doc.text(
      `Pozostało do zapłaty: ${formatCurrency(
        invoice.remainingAmount || 0,
        invoice.currency
      )}`,
      PAGE_MARGIN,
      currentY + 18
    );
    currentY += 40;
  }

  // Notes
  if (invoice.notes) {
    doc.setFontSize(12);
    doc.text("Uwagi", PAGE_MARGIN, currentY);
    doc.setFontSize(10);
    doc.text(
      doc.splitTextToSize(invoice.notes, pageWidth - PAGE_MARGIN * 2),
      PAGE_MARGIN,
      currentY + 16
    );
  }

  return doc.output("blob");
}
