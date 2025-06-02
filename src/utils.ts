export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

export function isValidPage(value: number) {
  if (value == null) {
    return false;
  }

  if (typeof value !== "number" && isNaN(value)) {
    return false;
  }
  if (value <= 0) {
    return false;
  }

  if (!Number.isInteger(value)) {
    return false;
  }

  return true;
}

export function getImagePath(image: string) {
  const cloudinaryUrl = "https://res.cloudinary.com";
  if (image.startsWith(cloudinaryUrl)) {
    return image;
  } else {
    if (process.env.SERVER_URL) {
      return `${process.env.SERVER_URL}/img/${image}`;
    } else {
      return `${process.env.NEXT_PUBLIC_SERVER_URL}/img/${image}`;
    }
  }
}

export const isAvailable = (inventory: number) => inventory > 0;
