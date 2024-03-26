"use server";

import {
  Client,
  Offer,
  OfferProduct,
  Product,
  ProductSize,
  Project,
} from "@prisma/client";
import { db } from "~/server/db";
import { offerProduct, productQuantity } from "~/app/types";

export async function fetchClients(): Promise<Client[]> {
  const clients = await db.client.findMany();
  return clients;
}

export async function fetchClientByName(
  clientName: string,
): Promise<Client | null> {
  const client = await db.client.findUnique({
    where: {
      clientName,
    },
  });
  return client;
}

export async function fetchProjects(client: Client): Promise<Project[]> {
  const projects = await db.project.findMany({
    where: {
      clientName: client.clientName,
    },
  });
  return projects;
}

export async function fetchProducts(): Promise<Product[]> {
  const products = await db.product.findMany();
  return products;
}

export async function fetchProduct(
  productName: string,
): Promise<Product | null> {
  const product = await db.product.findUnique({
    where: {
      productName,
    },
  });
  return product;
}

export async function fetchProductSizes(
  productId: number,
): Promise<ProductSize[]> {
  const productSizes = await db.productSize.findMany({
    where: {
      productId,
    },
  });
  return productSizes;
}

export async function addOffer(
  offer: Partial<Offer>,
  offerProducts: offerProduct[],
  offerId?: string | null,
): Promise<Offer> {
  if (offerId) {
    const oldOffer: Offer = await db.offer.update({
      where: {
        offerId: offerId,
      },
      data: {
        isCurrent: false,
      },
    });

    if (!oldOffer.isEnquired) {
      await db.offer.delete({
        where: {
          offerId: offerId,
        },
      });
    }
  }
  const newOffer = await db.offer.create({
    data: {
      offerNumber: offer.offerNumber ? offer.offerNumber : "",
      clientName: offer.clientName ? offer.clientName : "",
      projectId: offer.projectId ? offer.projectId : "",
      totalPrice: offer.totalPrice ? offer.totalPrice : 0,
    },
  });
  for (const offerProduct of offerProducts) {
    for (const productQuantity of offerProduct.productQuantities) {
      await db.offerProduct.create({
        data: {
          offerId: newOffer.offerId,
          productSizeId: productQuantity.productSize.productSizeId,
          quantity: productQuantity.quantity,
          discount: offerProduct.discount,
        },
      });
    }
  }
  return newOffer;
}

export async function AddClientServer(client: Partial<Client>) {
  try {
    if (!client.clientName) {
      throw new Error("Client name is required");
    }
    const newClient = await db.client.create({
      data: {
        clientName: client.clientName,
        address: client.address ?? "",
        alternateNumbers: client.alternateNumbers ?? [],
        mailId: client.mailId ?? [],
      },
    });
    return newClient;
  } catch (error: any) {
    throw new Error("Error adding client");
  }
}

export async function AddProductServer(
  product: Partial<Product>,
  productSizes: Partial<ProductSize>[],
) {
  try {
    const productExists = await db.product.findFirst({
      where: {
        productName: product.productName,
      },
    });
    if (productExists) {
      productSizes.forEach(async (productSize) => {
        await db.productSize.create({
          data: {
            productId: productExists.productId,
            size: productSize.size ?? 0,
            listPrice: productSize.listPrice ?? 0,
          },
        });
      });
      return productExists;
    }
    const newProduct = await db.product.create({
      data: {
        manufacturer: product.manufacturer ?? "",
        productName: product.productName ?? "",
        sizeUnit: product.sizeUnit ?? "",
      },
    });
    const productId = newProduct.productId;

    for (const productSize of productSizes) {
      await db.productSize.create({
        data: {
          productId,
          size: productSize.size ?? 0,
          listPrice: productSize.listPrice ?? 0,
        },
      });
    }

    return newProduct;
  } catch (error: any) {
    throw new Error("Error adding product");
  }
}

export async function AddProjectServer(project: Partial<Project>) {
  try {
    const newProject: Project = await db.project.create({
      data: {
        clientName: project.clientName ?? "",
        projectName: project.projectName ?? "",
      },
    });
    return newProject;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function fetchOfferProducts(
  offerId: string,
): Promise<offerProduct[]> {
  const OfferProducts: OfferProduct[] = await db.offerProduct.findMany({
    where: {
      offerId: offerId,
    },
  });

  const groupedOfferProducts: { [key: string]: offerProduct } = {};

  await Promise.all(
    OfferProducts.map(async (offerProduct) => {
      const productSize = await db.productSize.findUnique({
        where: {
          productSizeId: offerProduct.productSizeId,
        },
      });
      if (productSize) {
        const product = await db.product.findUnique({
          where: {
            productId: productSize.productId,
          },
        });
        if (product) {
          const key = `${product.productId}_${offerProduct.discount}`;
          if (!groupedOfferProducts[key]) {
            groupedOfferProducts[key] = {
              product: product,
              discount: offerProduct.discount,
              productQuantities: [],
            };
          }
          groupedOfferProducts[key]?.productQuantities.push({
            productSize: productSize,
            quantity: offerProduct.quantity,
          });
        }
      }
    }),
  );

  const offerProducts: offerProduct[] = Object.values(groupedOfferProducts);

  return offerProducts;
}

export async function fetchOffers(
  getCurrent: boolean = true,
): Promise<Offer[]> {
  const offers = await db.offer.findMany({
    where: {
      isCurrent: getCurrent,
    },
  });
  return offers;
}

export async function addToEnquiry(offerId: string): Promise<Offer> {
  const updatedOffer = db.offer.update({
    where: {
      offerId: offerId,
    },
    data: {
      isEnquired: true,
    },
  });
  return updatedOffer;
}

export const getProducts = async (page?: number, pageSize?: number) => {
  if (page && pageSize) {
    const products = await db.product.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return products;
  }
  const products = await db.product.findMany();
  return products;
};

export const getClients = async (page?: number, pageSize?: number) => {
  if (page && pageSize) {
    const clients = await db.client.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return clients;
  }
  const clients = await db.client.findMany();
  return clients;
};

export const getProjects = async (page?: number, pageSize?: number) => {
  if (page && pageSize) {
    const projects = await db.project.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return projects;
  }
  const projects = await db.project.findMany();
  return projects;
};

export async function getEnquiryOffers(startDate: Date, endDate: Date) {
  const offers = await db.offer.findMany({
    where: {
      isEnquired: true,
      createdDate: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  return offers;
}
